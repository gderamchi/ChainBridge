/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** A section of a document that can contain nested sections */
export interface Section {
  /** Optional prefix text for the section */
  prefix?: string | null;
  /** Optional content text for the section */
  content?: string | null;
  /** Array of nested sections */
  sections?: Section[];
}

export interface User {
  /**
   * Unique string identifier for the user
   * @example "0ec9852c2f"
   */
  sId?: string;
  /** @example 12345 */
  id?: number;
  /** @example 1625097600 */
  createdAt?: number;
  /**
   * User's chosen username
   * @example "johndoe"
   */
  username?: string;
  /**
   * User's email address
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * User's first name
   * @example "John"
   */
  firstName?: string;
  /**
   * User's last name
   * @example "Doe"
   */
  lastName?: string;
  /**
   * User's full name
   * @example "John Doe"
   */
  fullName?: string;
  /**
   * Authentication provider used by the user
   * @example "google"
   */
  provider?: string;
  /**
   * URL of the user's profile image
   * @example "https://example.com/profile/johndoe.jpg"
   */
  image?: string;
}

export interface Workspace {
  /** @example 67890 */
  id?: number;
  /**
   * Unique string identifier for the workspace
   * @example "dQFf9l5FQY"
   */
  sId?: string;
  /**
   * Name of the workspace
   * @example "My Awesome Workspace"
   */
  name?: string;
  /**
   * User's role in the workspace
   * @example "admin"
   */
  role?: string;
  /**
   * Segmentation information for the workspace
   * @example "enterprise"
   */
  segmentation?: string | null;
  /** @example ["advanced_analytics","beta_features"] */
  flags?: string[];
  /** @example true */
  ssoEnforced?: boolean;
  /** @example ["google","github"] */
  whiteListedProviders?: string[];
  /**
   * Default provider for embeddings in the workspace
   * @example "openai"
   */
  defaultEmbeddingProvider?: string | null;
}

export interface Context {
  /**
   * Username in the current context
   * @example "johndoe123"
   */
  username: string;
  /**
   * User's timezone
   * @example "America/New_York"
   */
  timezone: string;
  /**
   * User's full name in the current context
   * @example "John Doe"
   */
  fullName?: string;
  /**
   * User's email in the current context
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * URL of the user's profile picture
   * @example "https://example.com/profiles/johndoe123.jpg"
   */
  profilePictureUrl?: string;
  agenticMessageData?: {
    /** Type of the agentic message */
    type?: "run_agent" | "agent_handover";
    /**
     * ID of the origin message
     * @example "2b8e4f6a0c"
     */
    originMessageId?: string;
  };
}

export interface AgentConfiguration {
  /** @example 12345 */
  id?: number;
  /**
   * Unique string identifier for the agent configuration
   * @example "7f3a9c2b1e"
   */
  sId?: string;
  /** @example 2 */
  version?: number;
  /**
   * Timestamp of when the version was created
   * @example "2023-06-15T14:30:00Z"
   */
  versionCreatedAt?: string | null;
  /**
   * ID of the user who created this version
   * @example "0ec9852c2f"
   */
  versionAuthorId?: string | null;
  /**
   * Name of the agent configuration
   * @example "Customer Support Agent"
   */
  name?: string;
  /**
   * Description of the agent configuration
   * @example "An AI agent designed to handle customer support inquiries"
   */
  description?: string;
  /**
   * Instructions for the agent
   * @example "Always greet the customer politely and try to resolve their issue efficiently."
   */
  instructions?: string | null;
  /**
   * URL of the agent's picture
   * @example "https://example.com/agent-images/support-agent.png"
   */
  pictureUrl?: string;
  /**
   * Current status of the agent configuration
   * @example "active"
   */
  status?: string;
  /**
   * Scope of the agent configuration
   * @example "workspace"
   */
  scope?: string;
  /**
   * Status of the user favorite for this configuration
   * @example true
   */
  userFavorite?: boolean;
  model?: {
    /**
     * ID of the model provider
     * @example "openai"
     */
    providerId?: string;
    /**
     * ID of the specific model
     * @example "gpt-4"
     */
    modelId?: string;
    /** @example 0.7 */
    temperature?: number;
  };
  /** @example [] */
  actions?: any[];
  /** @example 10 */
  maxStepsPerRun?: number;
  /**
   * ID of the template used for this configuration
   * @example "b4e2f1a9c7"
   */
  templateId?: string | null;
}

export interface Conversation {
  conversation?: {
    /** @example 67890 */
    id?: number;
    /** @example 1625097600 */
    created?: number;
    /**
     * Unique string identifier for the conversation
     * @example "3d8f6a2c1b"
     */
    sId?: string;
    owner?: Workspace;
    /**
     * Title of the conversation
     * @example "Customer Inquiry #1234"
     */
    title?: string;
    /**
     * Visibility setting of the conversation
     * @example "private"
     */
    visibility?: string;
    content?: {
      /** @example 1 */
      id?: number;
      /**
       * Unique string identifier for the message
       * @example "9e7d5c3a1f"
       */
      sId?: string;
      /**
       * Type of the message
       * @example "human"
       */
      type?: string;
      /**
       * Visibility setting of the message
       * @example "visible"
       */
      visibility?: string;
      /** @example 1 */
      version?: number;
      /** @example 1625097700 */
      created?: number;
      user?: User;
      mentions?: Mention[];
      /**
       * Content of the message
       * @example "Hello, I need help with my order."
       */
      content?: string;
      context?: Context;
      /** @example 1 */
      agentMessageId?: number;
      /**
       * ID of the parent message
       * @example "2b8e4f6a0c"
       */
      parentMessageId?: string;
      /**
       * Status of the message
       * @example "completed"
       */
      status?: string;
      /** @example [] */
      actions?: any[];
      /**
       * Chain of thought for the message
       * @example "The user is asking about their order. I should first greet them and then ask for their order number."
       */
      chainOfThought?: string | null;
      rawContents?: {
        /** @example 1 */
        step?: number;
        /**
         * Content for each step
         * @example "Hello! I'd be happy to help you with your order. Could you please provide your order number?"
         */
        content?: string;
      }[];
      /**
       * Error message, if any
       * @example null
       */
      error?: string | null;
      configuration?: AgentConfiguration;
    }[][];
  };
}

export interface Mention {
  /**
   * ID of the mentioned agent configuration
   * @example "7f3a9c2b1e"
   */
  configurationId?: string;
}

/** A rich mention suggestion containing detailed information about an agent or user */
export interface RichMention {
  /**
   * Unique identifier for the mention (agent sId or user sId)
   * @example "7f3a9c2b1e"
   */
  id: string;
  /**
   * Type of the mention
   * @example "agent"
   */
  type: "agent" | "user";
  /**
   * Display label for the mention
   * @example "My Assistant"
   */
  label: string;
  /**
   * URL of the profile picture
   * @example "https://example.com/avatar.png"
   */
  pictureUrl: string;
  /**
   * Description of the mention (agent description or user email)
   * @example "A helpful AI assistant"
   */
  description: string;
  /**
   * Whether the agent is marked as a favorite by the user (only for agent mentions)
   * @example true
   */
  userFavorite?: boolean | null;
}

export interface Message {
  /**
   * The content of the message. Should not be empty.
   * @example "This is my message"
   */
  content: string;
  /** Empty array is accepted but won't trigger any agent. */
  mentions: Mention[];
  context?: Context;
}

export interface ContentFragment {
  /**
   * The title of the content fragment
   * @example "My content fragment"
   */
  title: string;
  /**
   * The content of the content fragment (optional if `fileId` is set)
   * @example "This is my content fragment extracted text"
   */
  content?: string;
  /**
   * The content type of the content fragment (optional if `fileId` is set)
   * @example "text/plain"
   */
  contentType?: string;
  /**
   * The URL of the content fragment
   * @example "https://example.com/content"
   */
  url?: string;
  /**
   * The id of the previously uploaded file (optional if `content` and `contentType` are set)
   * @example "fil_123456"
   */
  fileId?: string;
  /**
   * The id of the content node (optional if `content` and `contentType` are set)
   * @example "node_123456"
   */
  nodeId?: string;
  /**
   * The id of the data source view (optional if `content` and `contentType` are set)
   * @example "dsv_123456"
   */
  nodeDataSourceViewId?: string;
  context?: Context;
}

export interface Space {
  /** Unique string identifier for the space */
  sId?: string;
  /** Name of the space */
  name?: string;
  /** The kind of the space */
  kind?: "regular" | "global" | "system" | "public";
  /** List of group IDs that have access to the space */
  groupIds?: string[];
}

export interface Datasource {
  /**
   * Unique identifier for the datasource
   * @example 12345
   */
  id?: number;
  /**
   * Timestamp of when the datasource was created
   * @example 1625097600
   */
  createdAt?: number;
  /**
   * Name of the datasource
   * @example "Customer Knowledge Base"
   */
  name?: string;
  /**
   * Description of the datasource
   * @example "Contains all customer-related information and FAQs"
   */
  description?: string;
  /**
   * ID of the associated Dust API project
   * @example "5e9d8c7b6a"
   */
  dustAPIProjectId?: string;
  /**
   * ID of the connector used for this datasource
   * @example "1f3e5d7c9b"
   */
  connectorId?: string;
  /**
   * Provider of the connector (e.g., 'webcrawler')
   * @example "webcrawler"
   */
  connectorProvider?: string;
  /**
   * Whether this datasource is selected by default for agents
   * @example true
   */
  assistantDefaultSelected?: boolean;
}

export interface Table {
  /**
   * Name of the table
   * @deprecated
   * @example "Roi data"
   */
  name?: string;
  /**
   * Title of the table
   * @example "ROI Data"
   */
  title?: string;
  /**
   * Unique identifier for the table
   * @example "1234f4567c"
   */
  table_id?: string;
  /**
   * Description of the table
   * @example "roi data for Q1"
   */
  description?: string;
  /**
   * MIME type of the table
   * @example "text/csv"
   */
  mime_type?: string;
  /** Array of column definitions */
  schema?: {
    /**
     * Name of the column
     * @example "roi"
     */
    name?: string;
    /**
     * Data type of the column
     * @example "int"
     */
    value_type?: "text" | "int" | "float" | "bool" | "date";
    /**
     * Array of possible values for the column (null if unrestricted)
     * @example ["1","2","3"]
     */
    possible_values?: string[] | null;
  }[];
  /**
   * Unix timestamp of table creation/modification
   * @example 1732810375150
   */
  timestamp?: number;
  /** Array of tags associated with the table */
  tags?: string[];
  /**
   * ID of the table parent
   * @example "1234f4567c"
   */
  parent_id?: string;
  /**
   * Array of parent table IDs
   * @example ["1234f4567c"]
   */
  parents?: string[];
}

export interface DatasourceView {
  /** The category of the data source view */
  category?: "managed" | "folder" | "website" | "apps";
  /** Timestamp of when the data source view was created */
  createdAt?: number;
  dataSource?: Datasource;
  /** The user who last edited the data source view */
  editedByUser?: {
    /** Full name of the user */
    fullName?: string;
    /** Timestamp of when the data source view was last edited by the user */
    editedAt?: number;
  };
  /** Unique identifier for the data source view */
  id?: number;
  /** The kind of the data source view */
  kind?: "default" | "custom";
  /** List of IDs included in this view, null if complete data source is taken */
  parentsIn?: string[] | null;
  /** Unique string identifier for the data source view */
  sId?: string;
  /** Timestamp of when the data source view was last updated */
  updatedAt?: number;
  /** ID of the space containing the data source view */
  spaceId?: string;
}

export interface Run {
  /**
   * The ID of the run
   * @example "4a2c6e8b0d"
   */
  run_id?: string;
  /**
   * The ID of the app
   * @example "9f1d3b5a7c"
   */
  app_id?: string;
  status?: {
    /**
     * The status of the run
     * @example "succeeded"
     */
    run?: string;
    /**
     * The status of the build
     * @example "succeeded"
     */
    build?: string;
  };
  /**
   * The results of the run
   * @example {}
   */
  results?: object;
  /**
   * The hash of the app specification
   * @example "8c0a4e6d2f"
   */
  specification_hash?: string;
  traces?: {
    /**
     * The timestamp of the trace
     * @example 1234567890
     */
    timestamp?: number;
    /**
     * The trace
     * @example {}
     */
    trace?: object;
  }[][];
}

export interface Document {
  /** @example "3b7d9f1e5a" */
  data_source_id?: string;
  /** @example 1625097600 */
  created?: number;
  /** @example "2c4a6e8d0f" */
  document_id?: string;
  /**
   * Title of the document
   * @example "Customer Support FAQ"
   */
  title?: string;
  /**
   * MIME type of the table
   * @example "text/md"
   */
  mime_type?: string;
  /** @example 1625097600 */
  timestamp?: number;
  /** @example ["customer_support","faq"] */
  tags?: string[];
  /**
   * ID of the document parent
   * @example "1234f4567c"
   */
  parent_id?: string;
  /** @example ["7b9d1f3e5a","2c4a6e8d0f"] */
  parents?: string[];
  /** @example "https://example.com/support/article1" */
  source_url?: string | null;
  /** @example "a1b2c3d4e5" */
  hash?: string;
  /** @example 1024 */
  text_size?: number;
  /** @example 5 */
  chunk_count?: number;
  /** @example [{"chunk_id":"9f1d3b5a7c","text":"This is the first chunk of the document.","embedding":[0.1,0.2,0.3,0.4]},{"chunk_id":"4a2c6e8b0d","text":"This is the second chunk of the document.","embedding":[0.5,0.6,0.7,0.8]}] */
  chunks?: object[];
  /** @example "This is the full text content of the document. It contains multiple paragraphs and covers various topics related to customer support." */
  text?: string;
  /** @example 150 */
  token_count?: number | null;
}

export interface MCPServerView {
  /**
   * Unique identifier for the MCP server view
   * @example 123
   */
  id?: number;
  /**
   * Unique string identifier for the MCP server view
   * @example "mcp_sv_abc123"
   */
  sId?: string;
  /**
   * Custom name for the MCP server view (null if not set)
   * @example "My Custom MCP Server"
   */
  name?: string | null;
  /**
   * Custom description for the MCP server view (null if not set)
   * @example "This MCP server handles customer data operations"
   */
  description?: string | null;
  /**
   * Unix timestamp of when the MCP server view was created
   * @example 1625097600
   */
  createdAt?: number;
  /**
   * Unix timestamp of when the MCP server view was last updated
   * @example 1625184000
   */
  updatedAt?: number;
  /**
   * ID of the space containing the MCP server view
   * @example "spc_xyz789"
   */
  spaceId?: string;
  /**
   * Type of the MCP server
   * @example "remote"
   */
  serverType?: "remote" | "internal";
  server?: {
    /**
     * Unique string identifier for the MCP server
     * @example "mcp_srv_def456"
     */
    sId?: string;
    /**
     * Name of the MCP server
     * @example "Customer Data Server"
     */
    name?: string;
    /**
     * Version of the MCP server
     * @example "1.0.0"
     */
    version?: string;
    /**
     * Description of the MCP server
     * @example "Handles customer data operations and queries"
     */
    description?: string;
    /**
     * Icon identifier for the MCP server
     * @example "database"
     */
    icon?: string;
    authorization?: {
      /**
       * OAuth provider for authorization
       * @example "github"
       */
      provider?: string;
      /**
       * Supported use cases for the authorization
       * @example ["platform_actions"]
       */
      supported_use_cases?: ("platform_actions" | "personal_actions")[];
      /**
       * OAuth scope required
       * @example "repo:read"
       */
      scope?: string;
    } | null;
    tools?: {
      /**
       * Name of the tool
       * @example "query_customers"
       */
      name?: string;
      /**
       * Description of what the tool does
       * @example "Query customer database for information"
       */
      description?: string;
      /**
       * JSON Schema for the tool's input parameters
       * @example {"type":"object","properties":{"customerId":{"type":"string"}}}
       */
      inputSchema?: object;
    }[];
    /**
     * Availability status of the MCP server
     * @example "production"
     */
    availability?: string;
    /**
     * Whether multiple instances of this server can be created
     * @example false
     */
    allowMultipleInstances?: boolean;
    /**
     * URL to the server's documentation
     * @example "https://docs.example.com/mcp-server"
     */
    documentationUrl?: string | null;
  };
  /**
   * OAuth use case for the MCP server view
   * @example "platform_actions"
   */
  oAuthUseCase?: "platform_actions" | "personal_actions" | null;
  /** Information about the user who last edited the MCP server view */
  editedByUser?: {
    /**
     * Unix timestamp of when the edit occurred
     * @example 1625184000
     */
    editedAt?: number | null;
    /**
     * Full name of the editor
     * @example "John Doe"
     */
    fullName?: string | null;
    /**
     * Profile image URL of the editor
     * @example "https://example.com/profile/johndoe.jpg"
     */
    imageUrl?: string | null;
  };
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://dust.tt",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title DUST API Documentation
 * @version 1.0.2
 * @license MIT (https://opensource.org/licenses/MIT)
 * @baseUrl https://dust.tt
 *
 * The OpenAPI specification for the Dust.tt API
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Get the agent configurations for the workspace identified by {wId}.
     *
     * @tags Agents
     * @name V1WAssistantAgentConfigurationsList
     * @summary List agents
     * @request GET:/api/v1/w/{wId}/assistant/agent_configurations
     * @secure
     */
    v1WAssistantAgentConfigurationsList: (
      wId: string,
      query?: {
        /**
         * The view to use when retrieving agents:
         * - all: Retrieves all non-private agents (default if not authenticated)
         * - list: Retrieves all active agents accessible to the user (default if authenticated)
         * - published: Retrieves all agents with published scope
         * - global: Retrieves all global agents
         * - favorites: Retrieves all agents marked as favorites by the user (only available to authenticated users)
         */
        view?:
          | "all"
          | "list"
          | "workspace"
          | "published"
          | "global"
          | "favorites";
        /** When set to 'true', includes recent authors information for each agent */
        withAuthors?: "true" | "false";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Array of agent configurations, optionally including lastAuthors if withAuthors=true */
          agentConfigurations?: AgentConfiguration[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/agent_configurations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the agent configuration identified by {sId} in the workspace identified by {wId}.
     *
     * @tags Agents
     * @name V1WAssistantAgentConfigurationsDetail
     * @summary Get agent configuration
     * @request GET:/api/v1/w/{wId}/assistant/agent_configurations/{sId}
     * @secure
     */
    v1WAssistantAgentConfigurationsDetail: (
      wId: string,
      sId: string,
      query?: {
        /**
         * Configuration variant to retrieve. 'light' returns basic config without actions, 'full' includes complete actions/tools configuration
         * @default "light"
         */
        variant?: "light" | "full";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          agentConfiguration?: AgentConfiguration;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/agent_configurations/${sId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the agent configuration identified by {sId} in the workspace identified by {wId}.
     *
     * @tags Agents
     * @name V1WAssistantAgentConfigurationsPartialUpdate
     * @summary Update agent configuration
     * @request PATCH:/api/v1/w/{wId}/assistant/agent_configurations/{sId}
     * @secure
     */
    v1WAssistantAgentConfigurationsPartialUpdate: (
      wId: string,
      sId: string,
      data: {
        userFavorite?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          agentConfiguration?: AgentConfiguration;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/agent_configurations/${sId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Search for agent configurations by name in the workspace identified by {wId}.
     *
     * @tags Agents
     * @name V1WAssistantAgentConfigurationsSearchList
     * @summary Search agents by name
     * @request GET:/api/v1/w/{wId}/assistant/agent_configurations/search
     * @secure
     */
    v1WAssistantAgentConfigurationsSearchList: (
      wId: string,
      query: {
        /** Search query for agent configuration names */
        q: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          agentConfigurations?: AgentConfiguration[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/agent_configurations/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name V1WAssistantConversationsCancelCreate
     * @summary Cancel message generation in a conversation
     * @request POST:/api/v1/w/{wId}/assistant/conversations/{cId}/cancel
     * @secure
     */
    v1WAssistantConversationsCancelCreate: (
      wId: string,
      cId: string,
      data: {
        /** List of message IDs to cancel generation for */
        messageIds: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Indicates if the cancellation was successful */
          success?: boolean;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/cancel`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new content fragment in the workspace identified by {wId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsContentFragmentsCreate
     * @summary Create a content fragment
     * @request POST:/api/v1/w/{wId}/assistant/conversations/{cId}/content_fragments
     * @secure
     */
    v1WAssistantConversationsContentFragmentsCreate: (
      wId: string,
      cId: string,
      data: ContentFragment,
      params: RequestParams = {},
    ) =>
      this.request<ContentFragment, void>({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/content_fragments`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get the events for a conversation in the workspace identified by {wId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsEventsList
     * @summary Get the events for a conversation
     * @request GET:/api/v1/w/{wId}/assistant/conversations/{cId}/events
     * @secure
     */
    v1WAssistantConversationsEventsList: (
      wId: string,
      cId: string,
      query?: {
        /** ID of the last event */
        lastEventId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/events`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Retrieves all feedback entries for a specific conversation. Requires authentication and read:conversation scope.
     *
     * @tags Feedbacks
     * @name V1WAssistantConversationsFeedbacksList
     * @summary Get feedbacks for a conversation
     * @request GET:/api/v1/w/{wId}/assistant/conversations/{cId}/feedbacks
     * @secure
     */
    v1WAssistantConversationsFeedbacksList: (
      wId: string,
      cId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          feedbacks?: {
            /** ID of the message that received feedback */
            messageId?: string;
            /** ID of the agent message */
            agentMessageId?: number;
            /** ID of the user who gave feedback */
            userId?: number;
            /** Direction of the thumb feedback */
            thumbDirection?: "up" | "down";
            /** Optional feedback content/comment */
            content?: string | null;
            /** Timestamp when feedback was created */
            createdAt?: number;
            /** ID of the agent configuration */
            agentConfigurationId?: string;
            /** Version of the agent configuration */
            agentConfigurationVersion?: number;
            /** Whether the conversation was shared */
            isConversationShared?: boolean;
          }[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/feedbacks`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a conversation in the workspace identified by {wId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsDetail
     * @summary Get a conversation
     * @request GET:/api/v1/w/{wId}/assistant/conversations/{cId}
     * @secure
     */
    v1WAssistantConversationsDetail: (
      wId: string,
      cId: string,
      params: RequestParams = {},
    ) =>
      this.request<Conversation, void>({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Mark a conversation as read in the workspace identified by {wId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsPartialUpdate
     * @summary Mark a conversation as read
     * @request PATCH:/api/v1/w/{wId}/assistant/conversations/{cId}
     * @secure
     */
    v1WAssistantConversationsPartialUpdate: (
      wId: string,
      cId: string,
      data: {
        read?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success?: boolean;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get suggestions for mentions (agents and users) based on a query string, scoped to a specific conversation.
     *
     * @tags Mentions
     * @name V1WAssistantConversationsMentionsSuggestionsList
     * @summary Get mention suggestions for a conversation
     * @request GET:/api/v1/w/{wId}/assistant/conversations/{cId}/mentions/suggestions
     * @secure
     */
    v1WAssistantConversationsMentionsSuggestionsList: (
      wId: string,
      cId: string,
      query: {
        /** Search query string to filter suggestions */
        query: string;
        /** Array of mention types to include. Can be "agents", "users", or both. If not provided, defaults to agents and users. */
        select?: ("agents" | "users")[];
        /** Whether to include the current user in the suggestions. */
        current?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          suggestions?: RichMention[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/mentions/suggestions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name V1WAssistantConversationsMessagesEditCreate
     * @summary Edit an existing message in a conversation
     * @request POST:/api/v1/w/{wId}/assistant/conversations/{cId}/messages/{mId}/edit
     * @secure
     */
    v1WAssistantConversationsMessagesEditCreate: (
      wId: string,
      cId: string,
      mId: string,
      data: {
        /** New content for the message */
        content: string;
        /** List of agent mentions in the message */
        mentions: {
          /** ID of the mentioned agent configuration */
          configurationId: string;
        }[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** The edited user message */
          message?: object;
          /** Optional array of agent messages generated in response */
          agentMessages?: any[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/messages/${mId}/edit`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get events for a message in the workspace identified by {wId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsMessagesEventsList
     * @summary Get events for a message
     * @request GET:/api/v1/w/{wId}/assistant/conversations/{cId}/messages/{mId}/events
     * @secure
     */
    v1WAssistantConversationsMessagesEventsList: (
      wId: string,
      cId: string,
      mId: string,
      query?: {
        /** ID of the last event received */
        lastEventId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          events?: {
            /** ID of the event */
            id?: string;
            /** Type of the event */
            type?: string;
            data?: Message;
          }[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/messages/${mId}/events`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Submit user feedback (thumbs up/down) for a specific message in a conversation. Requires authentication and update:conversation scope.
     *
     * @tags Feedbacks
     * @name V1WAssistantConversationsMessagesFeedbacksCreate
     * @summary Submit feedback for a specific message in a conversation
     * @request POST:/api/v1/w/{wId}/assistant/conversations/{cId}/messages/{mId}/feedbacks
     * @secure
     */
    v1WAssistantConversationsMessagesFeedbacksCreate: (
      wId: string,
      cId: string,
      mId: string,
      data: {
        /** Direction of the thumb feedback */
        thumbDirection: "up" | "down";
        /** Optional feedback text content */
        feedbackContent?: string;
        /** Whether the conversation is shared */
        isConversationShared?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success?: boolean;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/messages/${mId}/feedbacks`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete user feedback for a specific message in a conversation. Requires authentication and update:conversation scope.
     *
     * @tags Feedbacks
     * @name V1WAssistantConversationsMessagesFeedbacksDelete
     * @summary Delete feedback for a specific message
     * @request DELETE:/api/v1/w/{wId}/assistant/conversations/{cId}/messages/{mId}/feedbacks
     * @secure
     */
    v1WAssistantConversationsMessagesFeedbacksDelete: (
      wId: string,
      cId: string,
      mId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success?: boolean;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/messages/${mId}/feedbacks`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Approves or rejects an action taken in a specific message in a conversation
     *
     * @tags Conversations
     * @name V1WAssistantConversationsMessagesValidateActionCreate
     * @summary Validate an action in a conversation message
     * @request POST:/api/v1/w/{wId}/assistant/conversations/{cId}/messages/{mId}/validate-action
     * @secure
     */
    v1WAssistantConversationsMessagesValidateActionCreate: (
      wId: string,
      cId: string,
      mId: string,
      data: {
        /** ID of the action to validate */
        actionId: string;
        /** Whether the action is approved or rejected */
        approved: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success?: boolean;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/messages/${mId}/validate-action`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a message in the workspace identified by {wId} in the conversation identified by {cId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsMessagesCreate
     * @summary Create a message
     * @request POST:/api/v1/w/{wId}/assistant/conversations/{cId}/messages
     * @secure
     */
    v1WAssistantConversationsMessagesCreate: (
      wId: string,
      cId: string,
      data: Message,
      params: RequestParams = {},
    ) =>
      this.request<Message, void>({
        path: `/api/v1/w/${wId}/assistant/conversations/${cId}/messages`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Create a new conversation in the workspace identified by {wId}.
     *
     * @tags Conversations
     * @name V1WAssistantConversationsCreate
     * @summary Create a new conversation
     * @request POST:/api/v1/w/{wId}/assistant/conversations
     * @secure
     */
    v1WAssistantConversationsCreate: (
      wId: string,
      data: {
        message: Message;
        /** The list of content fragments to attach to this conversation (optional) */
        contentFragments?: ContentFragment[];
        /**
         * The title of the conversation
         * @example "My conversation"
         */
        title?: string;
        /**
         * Whether to skip the tools validation of the agent messages triggered by this user message (optional, defaults to false)
         * @example false
         */
        skipToolsValidation?: boolean;
        /**
         * Whether to wait for the agent to generate the initial message. If true the query will wait for the agent's answer. If false (default), the API will return a conversation ID directly and you will need to use streaming events to get the messages.
         * @example true
         */
        blocking?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Conversation, void>({
        path: `/api/v1/w/${wId}/assistant/conversations`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Parses pasted text containing @ mentions and converts them to the proper mention format. Matches @agentName or @userName patterns against available agents and users.
     *
     * @tags Mentions
     * @name V1WAssistantMentionsParseCreate
     * @summary Parse mentions in markdown text
     * @request POST:/api/v1/w/{wId}/assistant/mentions/parse
     * @secure
     */
    v1WAssistantMentionsParseCreate: (
      wId: string,
      data: {
        /**
         * Markdown text containing @ mentions to parse
         * @example "Hello @JohnDoe, can you help with @MyAgent?"
         */
        markdown: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Processed markdown text with mentions converted to serialized format */
          markdown?: string;
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/mentions/parse`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get suggestions for mentions (agents and users) based on a query string.
     *
     * @tags Mentions
     * @name V1WAssistantMentionsSuggestionsList
     * @summary Get mention suggestions
     * @request GET:/api/v1/w/{wId}/assistant/mentions/suggestions
     * @secure
     */
    v1WAssistantMentionsSuggestionsList: (
      wId: string,
      query: {
        /** Search query string to filter suggestions */
        query: string;
        /** Array of mention types to include. Can be "agents", "users", or both. If not provided, defaults to agents and users. */
        select?: ("agents" | "users")[];
        /** Whether to include the current user in the suggestions. */
        current?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          suggestions?: RichMention[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/assistant/mentions/suggestions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Conversations
     * @name V1WFilesCreate
     * @summary Create a file upload URL
     * @request POST:/api/v1/w/{wId}/files
     * @secure
     */
    v1WFilesCreate: (
      wId: string,
      data: {
        /** MIME type of the file */
        contentType: string;
        /** Name of the file */
        fileName: string;
        /** Size of the file in bytes */
        fileSize: number;
        /** Intended use case for the file, use "conversation" */
        useCase: string;
        /** (optional) Metadata for the use case, for conversation useCase should be dictionary with conversationId stringified */
        useCaseMetadata: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          file?: {
            /** Unique string identifier for the file */
            sId?: string;
            /** Upload URL for the file */
            uploadUrl?: string;
          };
        },
        void
      >({
        path: `/api/v1/w/${wId}/files`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description [Documentation](https://docs.dust.tt/docs/client-side-mcp-server) Update the heartbeat for a previously registered client-side MCP server. This extends the TTL for the server registration.
     *
     * @tags MCP
     * @name V1WMcpHeartbeatCreate
     * @summary Update heartbeat for a client-side MCP server
     * @request POST:/api/v1/w/{wId}/mcp/heartbeat
     * @secure
     */
    v1WMcpHeartbeatCreate: (
      wId: string,
      data: {
        /** The ID of the registered MCP server */
        serverId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          success?: boolean;
          /** @format date-time */
          expiresAt?: string;
        },
        void
      >({
        path: `/api/v1/w/${wId}/mcp/heartbeat`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description [Documentation](https://docs.dust.tt/docs/client-side-mcp-server) Register a client-side MCP server to Dust. The registration is scoped to the current user and workspace. A serverId identifier is generated and returned in the response.
     *
     * @tags MCP
     * @name V1WMcpRegisterCreate
     * @summary Register a client-side MCP server
     * @request POST:/api/v1/w/{wId}/mcp/register
     * @secure
     */
    v1WMcpRegisterCreate: (
      wId: string,
      data: {
        /** Name of the MCP server */
        serverName: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          serverId?: string;
          /** @format date-time */
          expiresAt?: string;
        },
        void
      >({
        path: `/api/v1/w/${wId}/mcp/register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description [Documentation](https://docs.dust.tt/docs/client-side-mcp-server) Server-Sent Events (SSE) endpoint that streams MCP tool requests for a workspace. This endpoint is used by client-side MCP servers to listen for tool requests in real-time. The connection will remain open and events will be sent as new tool requests are made.
     *
     * @tags MCP
     * @name V1WMcpRequestsList
     * @summary Stream MCP tool requests for a workspace
     * @request GET:/api/v1/w/{wId}/mcp/requests
     * @secure
     */
    v1WMcpRequestsList: (
      wId: string,
      query: {
        /** ID of the MCP server to filter events for */
        serverId: string;
        /** ID of the last event to filter events for */
        lastEventId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Type of the event (e.g. "tool_request") */
          type?: string;
          /** The tool request data */
          data?: object;
        },
        void
      >({
        path: `/api/v1/w/${wId}/mcp/requests`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description [Documentation](https://docs.dust.tt/docs/client-side-mcp-server) Endpoint for client-side MCP servers to submit the results of tool executions. This endpoint accepts the output from tools that were executed locally.
     *
     * @tags MCP
     * @name V1WMcpResultsCreate
     * @summary Submit MCP tool execution results
     * @request POST:/api/v1/w/{wId}/mcp/results
     * @secure
     */
    v1WMcpResultsCreate: (
      wId: string,
      data: {
        /** The result data from the tool execution */
        result: object;
        /** ID of the MCP server submitting the results */
        serverId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/mcp/results`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Search for nodes in the workspace with SSE streaming
     *
     * @tags Search
     * @name V1WSearchList
     * @summary Search for nodes in the workspace (streaming)
     * @request GET:/api/v1/w/{wId}/search
     * @secure
     */
    v1WSearchList: (
      wId: string,
      query: {
        /** The search query (minimum 3 characters) */
        query: string;
        /** Number of results per page (1-100, default 25) */
        limit?: number;
        /** Cursor for pagination */
        cursor?: string;
        /** Type of view to filter results */
        viewType?: "all" | "document" | "table";
        /** Comma-separated list of space IDs to search in */
        spaceIds?: string;
        /** Whether to include data sources */
        includeDataSources?: boolean;
        /** Whether to search source URLs */
        searchSourceUrls?: boolean;
        /** Whether to include tool results */
        includeTools?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, void>({
        path: `/api/v1/w/${wId}/search`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Search for nodes in the workspace
     *
     * @tags Search
     * @name V1WSearchCreate
     * @summary Search for nodes in the workspace
     * @request POST:/api/v1/w/{wId}/search
     * @secure
     */
    v1WSearchCreate: (
      wId: string,
      data: {
        /** The search query */
        query: string;
        /** List of data source IDs to include in search */
        includeDataSources?: boolean;
        /** Type of view to filter results */
        viewType?: string;
        /** List of space IDs to search in */
        spaceIds?: string[];
        /** List of specific node IDs to search */
        nodeIds?: string[];
        /** Whether to search source URLs */
        searchSourceUrls?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/search`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Download and upload a file from a tool (MCP server) to Dust
     *
     * @tags Search
     * @name V1WSearchToolsUploadCreate
     * @summary Upload a tool file
     * @request POST:/api/v1/w/{wId}/search/tools/upload
     * @secure
     */
    v1WSearchToolsUploadCreate: (
      wId: string,
      data: {
        /** The MCP server view ID */
        serverViewId: string;
        /** The external ID of the file in the tool */
        externalId: string;
        /** Optional conversation ID for context */
        conversationId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/search/tools/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieve a run for an app in the space identified by {spaceId}.
     *
     * @tags Apps
     * @name V1WSpacesAppsRunsDetail
     * @summary Get an app run
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/apps/{aId}/runs/{runId}
     * @secure
     */
    v1WSpacesAppsRunsDetail: (
      wId: string,
      spaceId: string,
      aId: string,
      runId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          run?: Run;
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/apps/${aId}/runs/${runId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Create and execute a run for an app in the space specified by {spaceId}.
     *
     * @tags Apps
     * @name V1WSpacesAppsRunsCreate
     * @summary Create an app run
     * @request POST:/api/v1/w/{wId}/spaces/{spaceId}/apps/{aId}/runs
     * @secure
     */
    v1WSpacesAppsRunsCreate: (
      wId: string,
      spaceId: string,
      aId: string,
      data: {
        /** Hash of the app specification. Ensures API compatibility across app iterations. */
        specification_hash: string;
        /** Configuration for the app run */
        config: {
          /** Model configuration */
          model?: {
            /** ID of the model provider */
            provider_id?: string;
            /** ID of the model */
            model_id?: string;
            /** Whether to use caching */
            use_cache?: boolean;
            /** Whether to use streaming */
            use_stream?: boolean;
          };
        };
        /** Array of input objects for the app */
        inputs: Record<string, any>[];
        /** If true, the response will be streamed */
        stream?: boolean;
        /** If true, the request will block until the run is complete */
        blocking?: boolean;
        /** Array of block names to filter the response */
        block_filter?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          run?: Run;
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/apps/${aId}/runs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all apps in the space identified by {spaceId}.
     *
     * @tags Apps
     * @name V1WSpacesAppsList
     * @summary List apps
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/apps
     * @secure
     */
    v1WSpacesAppsList: (
      wId: string,
      spaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          apps?: {
            /** Unique identifier for the app */
            id?: number;
            /** Unique string identifier for the app */
            sId?: string;
            /** Name of the app */
            name?: string;
            /** Description of the app */
            description?: string;
            /** Saved specification of the app */
            savedSpecification?: string;
            /** Saved configuration of the app */
            savedConfig?: string;
            /** Saved run identifier of the app */
            savedRun?: string;
            /** ID of the associated Dust API project */
            dustAPIProjectId?: string;
          }[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/apps`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatasourceViews
     * @name V1WSpacesDataSourceViewsDetail
     * @summary Get a data source view
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_source_views/{dsvId}
     * @secure
     */
    v1WSpacesDataSourceViewsDetail: (
      wId: string,
      spaceId: string,
      dsvId: string,
      params: RequestParams = {},
    ) =>
      this.request<DatasourceView, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_source_views/${dsvId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatasourceViews
     * @name V1WSpacesDataSourceViewsPartialUpdate
     * @summary Update a data source view
     * @request PATCH:/api/v1/w/{wId}/spaces/{spaceId}/data_source_views/{dsvId}
     * @secure
     */
    v1WSpacesDataSourceViewsPartialUpdate: (
      wId: string,
      spaceId: string,
      dsvId: string,
      data:
        | {
            parentsIn: string[];
          }
        | {
            parentsToAdd?: string[];
            parentsToRemove?: string[];
          },
      params: RequestParams = {},
    ) =>
      this.request<DatasourceView, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_source_views/${dsvId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags DatasourceViews
     * @name V1WSpacesDataSourceViewsDelete
     * @summary Delete a data source view
     * @request DELETE:/api/v1/w/{wId}/spaces/{spaceId}/data_source_views/{dsvId}
     * @secure
     */
    v1WSpacesDataSourceViewsDelete: (
      wId: string,
      spaceId: string,
      dsvId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_source_views/${dsvId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Search the data source view identified by {dsvId} in the workspace identified by {wId}.
     *
     * @tags DatasourceViews
     * @name V1WSpacesDataSourceViewsSearchList
     * @summary Search the data source view
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_source_views/{dsvId}/search
     * @secure
     */
    v1WSpacesDataSourceViewsSearchList: (
      wId: string,
      spaceId: string,
      dsvId: string,
      query: {
        /** The search query */
        query: string;
        /** The number of results to return */
        top_k: number;
        /** Whether to return the full document content */
        full_text: boolean;
        /** The number of tokens in the target document */
        target_document_tokens?: number;
        /** The timestamp to filter by */
        timestamp_gt?: number;
        /** The timestamp to filter by */
        timestamp_lt?: number;
        /** The tags to filter by */
        tags_in?: string;
        /** The tags to filter by */
        tags_not?: string;
        /** The parents to filter by */
        parents_in?: string;
        /** The parents to filter by */
        parents_not?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          documents?: {
            /** ID of the document */
            id?: string;
            /** Title of the document */
            title?: string;
            /** Content of the document */
            content?: string;
            /** Tags of the document */
            tags?: string[];
            /** Parents of the document */
            parents?: string[];
            /** Timestamp of the document */
            timestamp?: number;
            /** Data of the document */
            data?: object;
            /** Score of the document */
            score?: number;
          }[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_source_views/${dsvId}/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of data source views for the specified space
     *
     * @tags DatasourceViews
     * @name V1WSpacesDataSourceViewsList
     * @summary List Data Source Views
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_source_views
     * @secure
     */
    v1WSpacesDataSourceViewsList: (
      wId: string,
      spaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          dataSourceViews?: DatasourceView[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_source_views`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns the number of running document upsert workflows for this data source. This endpoint is only accessible with system API keys (e.g., from connectors).
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesCheckUpsertQueueList
     * @summary Check the upsert queue status for a data source
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/check_upsert_queue
     * @secure
     */
    v1WSpacesDataSourcesCheckUpsertQueueList: (
      wId: string,
      spaceId: string,
      dsId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Number of currently running upsert workflows */
          running_count?: number;
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/check_upsert_queue`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a document from a data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesDocumentsDetail
     * @summary Retrieve a document from a data source
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/documents/{documentId}
     * @secure
     */
    v1WSpacesDataSourcesDocumentsDetail: (
      wId: string,
      spaceId: string,
      dsId: string,
      documentId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          document?: Document;
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/documents/${documentId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upsert a document in a data source in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesDocumentsCreate
     * @summary Upsert a document in a data source
     * @request POST:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/documents/{documentId}
     * @secure
     */
    v1WSpacesDataSourcesDocumentsCreate: (
      wId: string,
      spaceId: string,
      dsId: string,
      documentId: string,
      data: {
        /** The title of the document to upsert. */
        title?: string;
        /** The MIME type of the document to upsert. */
        mime_type?: string;
        /** The text content of the document to upsert. */
        text?: string;
        /** A section of a document that can contain nested sections */
        section?: Section;
        /** The source URL for the document to upsert. */
        source_url?: string;
        /** Tags to associate with the document. */
        tags?: string[];
        /** Unix timestamp (in milliseconds) for the document (e.g. 1736365559000). */
        timestamp?: number;
        /** If true, a lightweight version of the document will be returned in the response (excluding the text, chunks and vectors). Defaults to false. */
        light_document_output?: boolean;
        /** If true, the upsert operation will be performed asynchronously. */
        async?: boolean;
        /** Additional context for the upsert operation. */
        upsert_context?: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          document?: Document;
          data_source?: Datasource;
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/documents/${documentId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a document from a data source in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesDocumentsDelete
     * @summary Delete a document from a data source
     * @request DELETE:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/documents/{documentId}
     * @secure
     */
    v1WSpacesDataSourcesDocumentsDelete: (
      wId: string,
      spaceId: string,
      dsId: string,
      documentId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          document?: {
            document_id?: string;
          };
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/documents/${documentId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update the parents of a document in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesDocumentsParentsCreate
     * @summary Update the parents of a document
     * @request POST:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/documents/{documentId}/parents
     * @secure
     */
    v1WSpacesDataSourcesDocumentsParentsCreate: (
      wId: string,
      spaceId: string,
      dsId: string,
      documentId: string,
      data: {
        /** Direct parent ID of the document */
        parent_id?: string;
        /** Document and ancestor ids, with the following convention: parents[0] === documentId, parents[1] === parentId, and then ancestors ids in order */
        parents?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/documents/${documentId}/parents`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get documents in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesDocumentsList
     * @summary Get documents
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/documents
     * @secure
     */
    v1WSpacesDataSourcesDocumentsList: (
      wId: string,
      spaceId: string,
      dsId: string,
      query?: {
        /** The IDs of the documents to fetch (optional) */
        document_ids?: string[];
        /** Limit the number of documents returned */
        limit?: number;
        /** Offset the returned documents */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          documents?: Document[];
          total?: number;
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/documents`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Search the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesSearchList
     * @summary Search the data source
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/search
     * @secure
     */
    v1WSpacesDataSourcesSearchList: (
      wId: string,
      spaceId: string,
      dsId: string,
      query: {
        /** The search query */
        query: string;
        /** The number of results to return */
        top_k: number;
        /** Whether to return the full document content */
        full_text: boolean;
        /** The number of tokens in the target document */
        target_document_tokens?: number;
        /** The timestamp to filter by */
        timestamp_gt?: number;
        /** The timestamp to filter by */
        timestamp_lt?: number;
        /** The tags to filter by */
        tags_in?: string;
        /** The tags to filter by */
        tags_not?: string;
        /** The parents to filter by */
        parents_in?: string;
        /** The parents to filter by */
        parents_not?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          documents?: {
            /** ID of the document */
            id?: string;
            /** Title of the document */
            title?: string;
            /** Content of the document */
            content?: string;
            /** Tags of the document */
            tags?: string[];
            /** Parents of the document */
            parents?: string[];
            /** Timestamp of the document */
            timestamp?: number;
            /** Data of the document */
            data?: object;
            /** Score of the document */
            score?: number;
          }[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/search`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Get a table in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesDetail
     * @summary Get a table
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables/{tId}
     * @secure
     */
    v1WSpacesDataSourcesTablesDetail: (
      wId: string,
      spaceId: string,
      dsId: string,
      tId: string,
      params: RequestParams = {},
    ) =>
      this.request<Table, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables/${tId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a table in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesDelete
     * @summary Delete a table
     * @request DELETE:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables/{tId}
     * @secure
     */
    v1WSpacesDataSourcesTablesDelete: (
      wId: string,
      spaceId: string,
      dsId: string,
      tId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables/${tId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Get a row in the table identified by {tId} in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesRowsDetail
     * @summary Get a row
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables/{tId}/rows/{rId}
     * @secure
     */
    v1WSpacesDataSourcesTablesRowsDetail: (
      wId: string,
      spaceId: string,
      dsId: string,
      tId: string,
      rId: string,
      params: RequestParams = {},
    ) =>
      this.request<Datasource, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables/${tId}/rows/${rId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a row in the table identified by {tId} in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesRowsDelete
     * @summary Delete a row
     * @request DELETE:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables/{tId}/rows/{rId}
     * @secure
     */
    v1WSpacesDataSourcesTablesRowsDelete: (
      wId: string,
      spaceId: string,
      dsId: string,
      tId: string,
      rId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables/${tId}/rows/${rId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description List rows in the table identified by {tId} in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesRowsList
     * @summary List rows
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables/{tId}/rows
     * @secure
     */
    v1WSpacesDataSourcesTablesRowsList: (
      wId: string,
      spaceId: string,
      dsId: string,
      tId: string,
      query?: {
        /** Limit the number of rows returned */
        limit?: number;
        /** Offset the returned rows */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Datasource[], void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables/${tId}/rows`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upsert rows in the table identified by {tId} in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesRowsCreate
     * @summary Upsert rows
     * @request POST:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables/{tId}/rows
     * @secure
     */
    v1WSpacesDataSourcesTablesRowsCreate: (
      wId: string,
      spaceId: string,
      dsId: string,
      tId: string,
      data: {
        rows?: {
          /** Unique identifier for the row */
          row_id?: string;
          value?: Record<
            string,
            | string
            | number
            | boolean
            | {
                type?: "datetime";
                epoch?: number;
              }
          >;
        }[];
        /** Whether to truncate existing rows */
        truncate?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Datasource, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables/${tId}/rows`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get tables in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesList
     * @summary Get tables
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables
     * @secure
     */
    v1WSpacesDataSourcesTablesList: (
      wId: string,
      spaceId: string,
      dsId: string,
      params: RequestParams = {},
    ) =>
      this.request<Table[], void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Upsert a table in the data source identified by {dsId} in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesTablesCreate
     * @summary Upsert a table
     * @request POST:/api/v1/w/{wId}/spaces/{spaceId}/data_sources/{dsId}/tables
     * @secure
     */
    v1WSpacesDataSourcesTablesCreate: (
      wId: string,
      spaceId: string,
      dsId: string,
      data: {
        /** Name of the table */
        name?: string;
        /** Title of the table */
        title?: string;
        /** Unique identifier for the table */
        table_id?: string;
        /** Description of the table */
        description?: string;
        /** Unix timestamp (in milliseconds) for the table (e.g. 1736365559000). */
        timestamp?: number;
        /** Tags associated with the table */
        tags?: string[];
        /** Reserved for internal use, should not be set. Mime type of the table */
        mime_type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Table, void>({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources/${dsId}/tables`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get data sources in the workspace identified by {wId}.
     *
     * @tags Datasources
     * @name V1WSpacesDataSourcesList
     * @summary Get data sources
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/data_sources
     * @secure
     */
    v1WSpacesDataSourcesList: (
      wId: string,
      spaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data_sources?: Datasource[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/data_sources`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of enabled MCP server views (aka tools) for a specific space of the authenticated workspace.
     *
     * @tags Tools
     * @name V1WSpacesMcpServerViewsList
     * @summary List available MCP server views.
     * @request GET:/api/v1/w/{wId}/spaces/{spaceId}/mcp_server_views
     * @secure
     */
    v1WSpacesMcpServerViewsList: (
      wId: string,
      spaceId: string,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          spaces?: MCPServerView[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces/${spaceId}/mcp_server_views`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieves a list of accessible spaces for the authenticated workspace.
     *
     * @tags Spaces
     * @name V1WSpacesList
     * @summary List available spaces.
     * @request GET:/api/v1/w/{wId}/spaces
     * @secure
     */
    v1WSpacesList: (wId: string, params: RequestParams = {}) =>
      this.request<
        {
          spaces?: Space[];
        },
        void
      >({
        path: `/api/v1/w/${wId}/spaces`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Skeleton endpoint that verifies workspace and webhook source and logs receipt.
     *
     * @tags Triggers
     * @name V1WTriggersHooksCreate
     * @summary Receive external webhook to trigger flows
     * @request POST:/api/v1/w/{wId}/triggers/hooks/{webhookSourceId}
     * @secure
     */
    v1WTriggersHooksCreate: (
      wId: string,
      webhookSourceId: string,
      data: object,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/v1/w/${wId}/triggers/hooks/${webhookSourceId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get usage data for the workspace identified by {wId} in CSV or JSON format.
     *
     * @tags Workspace
     * @name V1WWorkspaceUsageList
     * @summary Get workspace usage data
     * @request GET:/api/v1/w/{wId}/workspace-usage
     * @secure
     */
    v1WWorkspaceUsageList: (
      wId: string,
      query: {
        /** The start date in YYYY-MM or YYYY-MM-DD format */
        start: string;
        /** The end date in YYYY-MM or YYYY-MM-DD format (required when mode is 'range') */
        end?: string;
        /** The mode of date range selection */
        mode: "month" | "range";
        /** The output format of the data (defaults to 'csv') */
        format?: "csv" | "json";
        /**
         * The name of the usage table to retrieve:
         * - "users": The list of users categorized by their activity level.
         * - "assistant_messages": The list of messages sent by users including the mentioned agents.
         * - "builders": The list of builders categorized by their activity level.
         * - "assistants": The list of workspace agents and their corresponding usage.
         * - "feedback": The list of feedback given by users on the agent messages.
         * - "all": A concatenation of all the above tables.
         */
        table:
          | "users"
          | "assistant_messages"
          | "builders"
          | "assistants"
          | "feedback"
          | "all";
        /** Include users and assistants with zero messages in the export (defaults to false) */
        includeInactive?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, void>({
        path: `/api/v1/w/${wId}/workspace-usage`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
