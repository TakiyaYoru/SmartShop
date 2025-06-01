import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const typeDef = `
  type LoginResult {
    jwt: String!
    user: UserInfo!
  }

  type UserInfo {
    _id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    role: String!
  }

  type LoginResponse {
    success: Boolean!
    message: String!
    data: LoginResult
  }

  type RegisterResponse {
    success: Boolean!
    message: String!
    data: UserInfo
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String
  }

  extend type Mutation {
    login(input: LoginInput!): LoginResponse
    register(input: RegisterInput!): RegisterResponse
  }

  extend type Query {
    me: UserInfo
  }
`;

export const resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      if (!context.user) {
        throw new GraphQLError("Authentication required");
      }
      
      const user = await context.db.users.findById(context.user.id);
      if (!user) {
        throw new GraphQLError("User not found");
      }
      
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };
    },
  },

  Mutation: {
    login: async (parent, args, context, info) => {
      const { username, password } = args.input;
      
      if (!username || username.length === 0 || !password || password.length === 0) {
        return {
          success: false,
          message: "Username and password are required",
        };
      }

      const user = await context.db.users.findOne(username);
      if (!user) {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: "Account is deactivated. Please contact support.",
        };
      }

      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      return {
        success: true,
        message: "Login successful",
        data: {
          jwt: token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        },
      };
    },

    register: async (parent, args, context, info) => {
      const { username, email, password, firstName, lastName, phone } = args.input;

      // Kiểm tra user đã tồn tại
      const existingUserByUsername = await context.db.users.findOne(username);
      if (existingUserByUsername) {
        return {
          success: false,
          message: "Username already exists",
        };
      }

      const existingUserByEmail = await context.db.users.findByEmail(email);
      if (existingUserByEmail) {
        return {
          success: false,
          message: "Email already exists",
        };
      }

      // Validate password
      if (password.length < 6) {
        return {
          success: false,
          message: "Password must be at least 6 characters long",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      const newUser = await context.db.users.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: "customer", // Default role
        isActive: true,
      });

      return {
        success: true,
        message: "Registration successful",
        data: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      };
    },
  },
};