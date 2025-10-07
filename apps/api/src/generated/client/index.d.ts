/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Event
 *
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>;
/**
 * Model Venue
 *
 */
export type Venue = $Result.DefaultSelection<Prisma.$VenuePayload>;
/**
 * Model WaitlistEntry
 *
 */
export type WaitlistEntry =
  $Result.DefaultSelection<Prisma.$WaitlistEntryPayload>;
/**
 * Model Session
 *
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>;
/**
 * Model AuditLog
 *
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>;
/**
 * Model Show
 *
 */
export type Show = $Result.DefaultSelection<Prisma.$ShowPayload>;
/**
 * Model Category
 *
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>;
/**
 * Model EmailVerification
 *
 */
export type EmailVerification =
  $Result.DefaultSelection<Prisma.$EmailVerificationPayload>;
/**
 * Model Consent
 *
 */
export type Consent = $Result.DefaultSelection<Prisma.$ConsentPayload>;
/**
 * Model NearbyPlace
 *
 */
export type NearbyPlace = $Result.DefaultSelection<Prisma.$NearbyPlacePayload>;
/**
 * Model Invitation
 *
 */
export type Invitation = $Result.DefaultSelection<Prisma.$InvitationPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
    VISITOR: 'VISITOR';
    OWNER: 'OWNER';
    ADMIN: 'ADMIN';
  };

  export type UserRole = (typeof UserRole)[keyof typeof UserRole];

  export const EventStatus: {
    DRAFT: 'DRAFT';
    PUBLISHED: 'PUBLISHED';
    CANCELLED: 'CANCELLED';
    COMPLETED: 'COMPLETED';
  };

  export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

  export const WaitlistStatus: {
    PENDING: 'PENDING';
    CONFIRMED: 'CONFIRMED';
    CANCELLED: 'CANCELLED';
  };

  export type WaitlistStatus =
    (typeof WaitlistStatus)[keyof typeof WaitlistStatus];

  export const EmailVerificationType: {
    MAGIC_LINK: 'MAGIC_LINK';
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION';
    PASSWORD_RESET: 'PASSWORD_RESET';
    OWNER_INVITATION: 'OWNER_INVITATION';
  };

  export type EmailVerificationType =
    (typeof EmailVerificationType)[keyof typeof EmailVerificationType];

  export const ConsentType: {
    ANALYTICS: 'ANALYTICS';
    MARKETING: 'MARKETING';
    NECESSARY: 'NECESSARY';
    FUNCTIONAL: 'FUNCTIONAL';
  };

  export type ConsentType = (typeof ConsentType)[keyof typeof ConsentType];
}

export type UserRole = $Enums.UserRole;

export const UserRole: typeof $Enums.UserRole;

export type EventStatus = $Enums.EventStatus;

export const EventStatus: typeof $Enums.EventStatus;

export type WaitlistStatus = $Enums.WaitlistStatus;

export const WaitlistStatus: typeof $Enums.WaitlistStatus;

export type EmailVerificationType = $Enums.EmailVerificationType;

export const EmailVerificationType: typeof $Enums.EmailVerificationType;

export type ConsentType = $Enums.ConsentType;

export const ConsentType: typeof $Enums.ConsentType;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent
    ) => void
  ): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
   * ```
   */
  get event(): Prisma.EventDelegate<ExtArgs>;

  /**
   * `prisma.venue`: Exposes CRUD operations for the **Venue** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Venues
   * const venues = await prisma.venue.findMany()
   * ```
   */
  get venue(): Prisma.VenueDelegate<ExtArgs>;

  /**
   * `prisma.waitlistEntry`: Exposes CRUD operations for the **WaitlistEntry** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more WaitlistEntries
   * const waitlistEntries = await prisma.waitlistEntry.findMany()
   * ```
   */
  get waitlistEntry(): Prisma.WaitlistEntryDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Sessions
   * const sessions = await prisma.session.findMany()
   * ```
   */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more AuditLogs
   * const auditLogs = await prisma.auditLog.findMany()
   * ```
   */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs>;

  /**
   * `prisma.show`: Exposes CRUD operations for the **Show** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Shows
   * const shows = await prisma.show.findMany()
   * ```
   */
  get show(): Prisma.ShowDelegate<ExtArgs>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   */
  get category(): Prisma.CategoryDelegate<ExtArgs>;

  /**
   * `prisma.emailVerification`: Exposes CRUD operations for the **EmailVerification** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more EmailVerifications
   * const emailVerifications = await prisma.emailVerification.findMany()
   * ```
   */
  get emailVerification(): Prisma.EmailVerificationDelegate<ExtArgs>;

  /**
   * `prisma.consent`: Exposes CRUD operations for the **Consent** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Consents
   * const consents = await prisma.consent.findMany()
   * ```
   */
  get consent(): Prisma.ConsentDelegate<ExtArgs>;

  /**
   * `prisma.nearbyPlace`: Exposes CRUD operations for the **NearbyPlace** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more NearbyPlaces
   * const nearbyPlaces = await prisma.nearbyPlace.findMany()
   * ```
   */
  get nearbyPlace(): Prisma.NearbyPlaceDelegate<ExtArgs>;

  /**
   * `prisma.invitation`: Exposes CRUD operations for the **Invitation** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Invitations
   * const invitations = await prisma.invitation.findMany()
   * ```
   */
  get invitation(): Prisma.InvitationDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import NotFoundError = runtime.NotFoundError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? K : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: 'User';
    Event: 'Event';
    Venue: 'Venue';
    WaitlistEntry: 'WaitlistEntry';
    Session: 'Session';
    AuditLog: 'AuditLog';
    Show: 'Show';
    Category: 'Category';
    EmailVerification: 'EmailVerification';
    Consent: 'Consent';
    NearbyPlace: 'NearbyPlace';
    Invitation: 'Invitation';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs; clientOptions: PrismaClientOptions },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      this['params']['clientOptions']
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    ClientOptions = {},
  > = {
    meta: {
      modelProps:
        | 'user'
        | 'event'
        | 'venue'
        | 'waitlistEntry'
        | 'session'
        | 'auditLog'
        | 'show'
        | 'category'
        | 'emailVerification'
        | 'consent'
        | 'nearbyPlace'
        | 'invitation';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>;
        fields: Prisma.EventFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[];
          };
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[];
          };
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EventPayload>;
          };
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateEvent>;
          };
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>;
            result: $Utils.Optional<EventGroupByOutputType>[];
          };
          count: {
            args: Prisma.EventCountArgs<ExtArgs>;
            result: $Utils.Optional<EventCountAggregateOutputType> | number;
          };
        };
      };
      Venue: {
        payload: Prisma.$VenuePayload<ExtArgs>;
        fields: Prisma.VenueFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.VenueFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.VenueFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>;
          };
          findFirst: {
            args: Prisma.VenueFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.VenueFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>;
          };
          findMany: {
            args: Prisma.VenueFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>[];
          };
          create: {
            args: Prisma.VenueCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>;
          };
          createMany: {
            args: Prisma.VenueCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.VenueCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>[];
          };
          delete: {
            args: Prisma.VenueDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>;
          };
          update: {
            args: Prisma.VenueUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>;
          };
          deleteMany: {
            args: Prisma.VenueDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.VenueUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.VenueUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$VenuePayload>;
          };
          aggregate: {
            args: Prisma.VenueAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateVenue>;
          };
          groupBy: {
            args: Prisma.VenueGroupByArgs<ExtArgs>;
            result: $Utils.Optional<VenueGroupByOutputType>[];
          };
          count: {
            args: Prisma.VenueCountArgs<ExtArgs>;
            result: $Utils.Optional<VenueCountAggregateOutputType> | number;
          };
        };
      };
      WaitlistEntry: {
        payload: Prisma.$WaitlistEntryPayload<ExtArgs>;
        fields: Prisma.WaitlistEntryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.WaitlistEntryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.WaitlistEntryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>;
          };
          findFirst: {
            args: Prisma.WaitlistEntryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.WaitlistEntryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>;
          };
          findMany: {
            args: Prisma.WaitlistEntryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>[];
          };
          create: {
            args: Prisma.WaitlistEntryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>;
          };
          createMany: {
            args: Prisma.WaitlistEntryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.WaitlistEntryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>[];
          };
          delete: {
            args: Prisma.WaitlistEntryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>;
          };
          update: {
            args: Prisma.WaitlistEntryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>;
          };
          deleteMany: {
            args: Prisma.WaitlistEntryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.WaitlistEntryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.WaitlistEntryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$WaitlistEntryPayload>;
          };
          aggregate: {
            args: Prisma.WaitlistEntryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateWaitlistEntry>;
          };
          groupBy: {
            args: Prisma.WaitlistEntryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<WaitlistEntryGroupByOutputType>[];
          };
          count: {
            args: Prisma.WaitlistEntryCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<WaitlistEntryCountAggregateOutputType>
              | number;
          };
        };
      };
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>;
        fields: Prisma.SessionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[];
          };
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>;
          };
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSession>;
          };
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<SessionGroupByOutputType>[];
          };
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>;
            result: $Utils.Optional<SessionCountAggregateOutputType> | number;
          };
        };
      };
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>;
        fields: Prisma.AuditLogFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
          };
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
          };
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>;
          };
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAuditLog>;
          };
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AuditLogGroupByOutputType>[];
          };
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>;
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number;
          };
        };
      };
      Show: {
        payload: Prisma.$ShowPayload<ExtArgs>;
        fields: Prisma.ShowFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ShowFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ShowFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>;
          };
          findFirst: {
            args: Prisma.ShowFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ShowFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>;
          };
          findMany: {
            args: Prisma.ShowFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>[];
          };
          create: {
            args: Prisma.ShowCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>;
          };
          createMany: {
            args: Prisma.ShowCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ShowCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>[];
          };
          delete: {
            args: Prisma.ShowDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>;
          };
          update: {
            args: Prisma.ShowUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>;
          };
          deleteMany: {
            args: Prisma.ShowDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ShowUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ShowUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ShowPayload>;
          };
          aggregate: {
            args: Prisma.ShowAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateShow>;
          };
          groupBy: {
            args: Prisma.ShowGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ShowGroupByOutputType>[];
          };
          count: {
            args: Prisma.ShowCountArgs<ExtArgs>;
            result: $Utils.Optional<ShowCountAggregateOutputType> | number;
          };
        };
      };
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>;
        fields: Prisma.CategoryFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[];
          };
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>;
          };
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCategory>;
          };
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CategoryGroupByOutputType>[];
          };
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>;
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number;
          };
        };
      };
      EmailVerification: {
        payload: Prisma.$EmailVerificationPayload<ExtArgs>;
        fields: Prisma.EmailVerificationFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.EmailVerificationFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.EmailVerificationFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
          };
          findFirst: {
            args: Prisma.EmailVerificationFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.EmailVerificationFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
          };
          findMany: {
            args: Prisma.EmailVerificationFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[];
          };
          create: {
            args: Prisma.EmailVerificationCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
          };
          createMany: {
            args: Prisma.EmailVerificationCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.EmailVerificationCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>[];
          };
          delete: {
            args: Prisma.EmailVerificationDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
          };
          update: {
            args: Prisma.EmailVerificationUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
          };
          deleteMany: {
            args: Prisma.EmailVerificationDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.EmailVerificationUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.EmailVerificationUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationPayload>;
          };
          aggregate: {
            args: Prisma.EmailVerificationAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateEmailVerification>;
          };
          groupBy: {
            args: Prisma.EmailVerificationGroupByArgs<ExtArgs>;
            result: $Utils.Optional<EmailVerificationGroupByOutputType>[];
          };
          count: {
            args: Prisma.EmailVerificationCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<EmailVerificationCountAggregateOutputType>
              | number;
          };
        };
      };
      Consent: {
        payload: Prisma.$ConsentPayload<ExtArgs>;
        fields: Prisma.ConsentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ConsentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ConsentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>;
          };
          findFirst: {
            args: Prisma.ConsentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ConsentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>;
          };
          findMany: {
            args: Prisma.ConsentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>[];
          };
          create: {
            args: Prisma.ConsentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>;
          };
          createMany: {
            args: Prisma.ConsentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ConsentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>[];
          };
          delete: {
            args: Prisma.ConsentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>;
          };
          update: {
            args: Prisma.ConsentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>;
          };
          deleteMany: {
            args: Prisma.ConsentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ConsentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.ConsentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ConsentPayload>;
          };
          aggregate: {
            args: Prisma.ConsentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateConsent>;
          };
          groupBy: {
            args: Prisma.ConsentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ConsentGroupByOutputType>[];
          };
          count: {
            args: Prisma.ConsentCountArgs<ExtArgs>;
            result: $Utils.Optional<ConsentCountAggregateOutputType> | number;
          };
        };
      };
      NearbyPlace: {
        payload: Prisma.$NearbyPlacePayload<ExtArgs>;
        fields: Prisma.NearbyPlaceFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.NearbyPlaceFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.NearbyPlaceFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>;
          };
          findFirst: {
            args: Prisma.NearbyPlaceFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.NearbyPlaceFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>;
          };
          findMany: {
            args: Prisma.NearbyPlaceFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>[];
          };
          create: {
            args: Prisma.NearbyPlaceCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>;
          };
          createMany: {
            args: Prisma.NearbyPlaceCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.NearbyPlaceCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>[];
          };
          delete: {
            args: Prisma.NearbyPlaceDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>;
          };
          update: {
            args: Prisma.NearbyPlaceUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>;
          };
          deleteMany: {
            args: Prisma.NearbyPlaceDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.NearbyPlaceUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.NearbyPlaceUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NearbyPlacePayload>;
          };
          aggregate: {
            args: Prisma.NearbyPlaceAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateNearbyPlace>;
          };
          groupBy: {
            args: Prisma.NearbyPlaceGroupByArgs<ExtArgs>;
            result: $Utils.Optional<NearbyPlaceGroupByOutputType>[];
          };
          count: {
            args: Prisma.NearbyPlaceCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<NearbyPlaceCountAggregateOutputType>
              | number;
          };
        };
      };
      Invitation: {
        payload: Prisma.$InvitationPayload<ExtArgs>;
        fields: Prisma.InvitationFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.InvitationFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.InvitationFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>;
          };
          findFirst: {
            args: Prisma.InvitationFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.InvitationFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>;
          };
          findMany: {
            args: Prisma.InvitationFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[];
          };
          create: {
            args: Prisma.InvitationCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>;
          };
          createMany: {
            args: Prisma.InvitationCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.InvitationCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[];
          };
          delete: {
            args: Prisma.InvitationDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>;
          };
          update: {
            args: Prisma.InvitationUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>;
          };
          deleteMany: {
            args: Prisma.InvitationDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.InvitationUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          upsert: {
            args: Prisma.InvitationUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>;
          };
          aggregate: {
            args: Prisma.InvitationAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateInvitation>;
          };
          groupBy: {
            args: Prisma.InvitationGroupByArgs<ExtArgs>;
            result: $Utils.Optional<InvitationGroupByOutputType>[];
          };
          count: {
            args: Prisma.InvitationCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<InvitationCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T['emit'] extends 'event'
        ? T['level']
        : never
      : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ?
          | GetLogType<T[0]>
          | GetLogType<T[1]>
          | GetLogType<T[2]>
          | GetLogType<T[3]>
      : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ownedEvents: number;
    waitlistEntries: number;
    sessions: number;
    auditLogs: number;
    emailVerifications: number;
    consents: number;
    invitationsSent: number;
    invitationsReceived: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    ownedEvents?: boolean | UserCountOutputTypeCountOwnedEventsArgs;
    waitlistEntries?: boolean | UserCountOutputTypeCountWaitlistEntriesArgs;
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs;
    emailVerifications?:
      | boolean
      | UserCountOutputTypeCountEmailVerificationsArgs;
    consents?: boolean | UserCountOutputTypeCountConsentsArgs;
    invitationsSent?: boolean | UserCountOutputTypeCountInvitationsSentArgs;
    invitationsReceived?:
      | boolean
      | UserCountOutputTypeCountInvitationsReceivedArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWaitlistEntriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WaitlistEntryWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AuditLogWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEmailVerificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EmailVerificationWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountConsentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ConsentWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvitationsSentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: InvitationWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountInvitationsReceivedArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: InvitationWhereInput;
  };

  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    waitlist: number;
    shows: number;
    nearbyPlaces: number;
  };

  export type EventCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    waitlist?: boolean | EventCountOutputTypeCountWaitlistArgs;
    shows?: boolean | EventCountOutputTypeCountShowsArgs;
    nearbyPlaces?: boolean | EventCountOutputTypeCountNearbyPlacesArgs;
  };

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountWaitlistArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WaitlistEntryWhereInput;
  };

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountShowsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ShowWhereInput;
  };

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountNearbyPlacesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NearbyPlaceWhereInput;
  };

  /**
   * Count Type VenueCountOutputType
   */

  export type VenueCountOutputType = {
    events: number;
  };

  export type VenueCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    events?: boolean | VenueCountOutputTypeCountEventsArgs;
  };

  // Custom InputTypes
  /**
   * VenueCountOutputType without action
   */
  export type VenueCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the VenueCountOutputType
     */
    select?: VenueCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * VenueCountOutputType without action
   */
  export type VenueCountOutputTypeCountEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventWhereInput;
  };

  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    events: number;
  };

  export type CategoryCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    events?: boolean | CategoryCountOutputTypeCountEventsArgs;
  };

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    role: $Enums.UserRole | null;
    isActive: boolean | null;
    lastLoginAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    name: string | null;
    role: $Enums.UserRole | null;
    isActive: boolean | null;
    lastLoginAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    name: number;
    role: number;
    isActive: number;
    lastLoginAt: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    role?: true;
    isActive?: true;
    lastLoginAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    role?: true;
    isActive?: true;
    lastLoginAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    name?: true;
    role?: true;
    isActive?: true;
    lastLoginAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserWhereInput;
    orderBy?:
      | UserOrderByWithAggregationInput
      | UserOrderByWithAggregationInput[];
    by: UserScalarFieldEnum[] | UserScalarFieldEnum;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };

  export type UserGroupByOutputType = {
    id: string;
    email: string;
    name: string | null;
    role: $Enums.UserRole;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      name?: boolean;
      role?: boolean;
      isActive?: boolean;
      lastLoginAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      ownedEvents?: boolean | User$ownedEventsArgs<ExtArgs>;
      waitlistEntries?: boolean | User$waitlistEntriesArgs<ExtArgs>;
      sessions?: boolean | User$sessionsArgs<ExtArgs>;
      auditLogs?: boolean | User$auditLogsArgs<ExtArgs>;
      emailVerifications?: boolean | User$emailVerificationsArgs<ExtArgs>;
      consents?: boolean | User$consentsArgs<ExtArgs>;
      invitationsSent?: boolean | User$invitationsSentArgs<ExtArgs>;
      invitationsReceived?: boolean | User$invitationsReceivedArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      name?: boolean;
      role?: boolean;
      isActive?: boolean;
      lastLoginAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    name?: boolean;
    role?: boolean;
    isActive?: boolean;
    lastLoginAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type UserInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    ownedEvents?: boolean | User$ownedEventsArgs<ExtArgs>;
    waitlistEntries?: boolean | User$waitlistEntriesArgs<ExtArgs>;
    sessions?: boolean | User$sessionsArgs<ExtArgs>;
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>;
    emailVerifications?: boolean | User$emailVerificationsArgs<ExtArgs>;
    consents?: boolean | User$consentsArgs<ExtArgs>;
    invitationsSent?: boolean | User$invitationsSentArgs<ExtArgs>;
    invitationsReceived?: boolean | User$invitationsReceivedArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'User';
    objects: {
      ownedEvents: Prisma.$EventPayload<ExtArgs>[];
      waitlistEntries: Prisma.$WaitlistEntryPayload<ExtArgs>[];
      sessions: Prisma.$SessionPayload<ExtArgs>[];
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[];
      emailVerifications: Prisma.$EmailVerificationPayload<ExtArgs>[];
      consents: Prisma.$ConsentPayload<ExtArgs>[];
      invitationsSent: Prisma.$InvitationPayload<ExtArgs>[];
      invitationsReceived: Prisma.$InvitationPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        name: string | null;
        role: $Enums.UserRole;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
    $Result.GetResult<Prisma.$UserPayload, S>;

  type UserCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['User'];
      meta: { name: 'User' };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetUserGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    ownedEvents<T extends User$ownedEventsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$ownedEventsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    waitlistEntries<T extends User$waitlistEntriesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$waitlistEntriesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sessionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$auditLogsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    emailVerifications<T extends User$emailVerificationsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$emailVerificationsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$EmailVerificationPayload<ExtArgs>,
          T,
          'findMany'
        >
      | Null
    >;
    consents<T extends User$consentsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$consentsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    invitationsSent<T extends User$invitationsSentArgs<ExtArgs> = {}>(
      args?: Subset<T, User$invitationsSentArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    invitationsReceived<T extends User$invitationsReceivedArgs<ExtArgs> = {}>(
      args?: Subset<T, User$invitationsReceivedArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly email: FieldRef<'User', 'String'>;
    readonly name: FieldRef<'User', 'String'>;
    readonly role: FieldRef<'User', 'UserRole'>;
    readonly isActive: FieldRef<'User', 'Boolean'>;
    readonly lastLoginAt: FieldRef<'User', 'DateTime'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly updatedAt: FieldRef<'User', 'DateTime'>;
    readonly deletedAt: FieldRef<'User', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User create
   */
  export type UserCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
  };

  /**
   * User.ownedEvents
   */
  export type User$ownedEventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    where?: EventWhereInput;
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    cursor?: EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * User.waitlistEntries
   */
  export type User$waitlistEntriesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    where?: WaitlistEntryWhereInput;
    orderBy?:
      | WaitlistEntryOrderByWithRelationInput
      | WaitlistEntryOrderByWithRelationInput[];
    cursor?: WaitlistEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[];
  };

  /**
   * User.sessions
   */
  export type User$sessionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    cursor?: SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    where?: AuditLogWhereInput;
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    cursor?: AuditLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * User.emailVerifications
   */
  export type User$emailVerificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    where?: EmailVerificationWhereInput;
    orderBy?:
      | EmailVerificationOrderByWithRelationInput
      | EmailVerificationOrderByWithRelationInput[];
    cursor?: EmailVerificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | EmailVerificationScalarFieldEnum
      | EmailVerificationScalarFieldEnum[];
  };

  /**
   * User.consents
   */
  export type User$consentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    where?: ConsentWhereInput;
    orderBy?:
      | ConsentOrderByWithRelationInput
      | ConsentOrderByWithRelationInput[];
    cursor?: ConsentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ConsentScalarFieldEnum | ConsentScalarFieldEnum[];
  };

  /**
   * User.invitationsSent
   */
  export type User$invitationsSentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    where?: InvitationWhereInput;
    orderBy?:
      | InvitationOrderByWithRelationInput
      | InvitationOrderByWithRelationInput[];
    cursor?: InvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[];
  };

  /**
   * User.invitationsReceived
   */
  export type User$invitationsReceivedArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    where?: InvitationWhereInput;
    orderBy?:
      | InvitationOrderByWithRelationInput
      | InvitationOrderByWithRelationInput[];
    cursor?: InvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
  };

  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null;
    _avg: EventAvgAggregateOutputType | null;
    _sum: EventSumAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
  };

  export type EventAvgAggregateOutputType = {
    capacity: number | null;
    currentWaitlist: number | null;
    mapLat: number | null;
    mapLng: number | null;
    mapZoom: number | null;
  };

  export type EventSumAggregateOutputType = {
    capacity: number | null;
    currentWaitlist: number | null;
    mapLat: number | null;
    mapLng: number | null;
    mapZoom: number | null;
  };

  export type EventMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    slug: string | null;
    description: string | null;
    shortDescription: string | null;
    status: $Enums.EventStatus | null;
    startDate: Date | null;
    endDate: Date | null;
    capacity: number | null;
    currentWaitlist: number | null;
    youtubeUrl: string | null;
    mapLat: number | null;
    mapLng: number | null;
    mapZoom: number | null;
    mapAddress: string | null;
    ownerId: string | null;
    venueId: string | null;
    categoryId: string | null;
    isPublic: boolean | null;
    featured: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type EventMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    slug: string | null;
    description: string | null;
    shortDescription: string | null;
    status: $Enums.EventStatus | null;
    startDate: Date | null;
    endDate: Date | null;
    capacity: number | null;
    currentWaitlist: number | null;
    youtubeUrl: string | null;
    mapLat: number | null;
    mapLng: number | null;
    mapZoom: number | null;
    mapAddress: string | null;
    ownerId: string | null;
    venueId: string | null;
    categoryId: string | null;
    isPublic: boolean | null;
    featured: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type EventCountAggregateOutputType = {
    id: number;
    title: number;
    slug: number;
    description: number;
    shortDescription: number;
    status: number;
    startDate: number;
    endDate: number;
    capacity: number;
    currentWaitlist: number;
    youtubeUrl: number;
    mapLat: number;
    mapLng: number;
    mapZoom: number;
    mapAddress: number;
    ownerId: number;
    venueId: number;
    categoryId: number;
    isPublic: number;
    featured: number;
    tags: number;
    metadata: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type EventAvgAggregateInputType = {
    capacity?: true;
    currentWaitlist?: true;
    mapLat?: true;
    mapLng?: true;
    mapZoom?: true;
  };

  export type EventSumAggregateInputType = {
    capacity?: true;
    currentWaitlist?: true;
    mapLat?: true;
    mapLng?: true;
    mapZoom?: true;
  };

  export type EventMinAggregateInputType = {
    id?: true;
    title?: true;
    slug?: true;
    description?: true;
    shortDescription?: true;
    status?: true;
    startDate?: true;
    endDate?: true;
    capacity?: true;
    currentWaitlist?: true;
    youtubeUrl?: true;
    mapLat?: true;
    mapLng?: true;
    mapZoom?: true;
    mapAddress?: true;
    ownerId?: true;
    venueId?: true;
    categoryId?: true;
    isPublic?: true;
    featured?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type EventMaxAggregateInputType = {
    id?: true;
    title?: true;
    slug?: true;
    description?: true;
    shortDescription?: true;
    status?: true;
    startDate?: true;
    endDate?: true;
    capacity?: true;
    currentWaitlist?: true;
    youtubeUrl?: true;
    mapLat?: true;
    mapLng?: true;
    mapZoom?: true;
    mapAddress?: true;
    ownerId?: true;
    venueId?: true;
    categoryId?: true;
    isPublic?: true;
    featured?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type EventCountAggregateInputType = {
    id?: true;
    title?: true;
    slug?: true;
    description?: true;
    shortDescription?: true;
    status?: true;
    startDate?: true;
    endDate?: true;
    capacity?: true;
    currentWaitlist?: true;
    youtubeUrl?: true;
    mapLat?: true;
    mapLng?: true;
    mapZoom?: true;
    mapAddress?: true;
    ownerId?: true;
    venueId?: true;
    categoryId?: true;
    isPublic?: true;
    featured?: true;
    tags?: true;
    metadata?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type EventAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Events
     **/
    _count?: true | EventCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: EventAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: EventSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EventMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EventMaxAggregateInputType;
  };

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
    [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>;
  };

  export type EventGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EventWhereInput;
    orderBy?:
      | EventOrderByWithAggregationInput
      | EventOrderByWithAggregationInput[];
    by: EventScalarFieldEnum[] | EventScalarFieldEnum;
    having?: EventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventCountAggregateInputType | true;
    _avg?: EventAvgAggregateInputType;
    _sum?: EventSumAggregateInputType;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
  };

  export type EventGroupByOutputType = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    shortDescription: string | null;
    status: $Enums.EventStatus;
    startDate: Date;
    endDate: Date | null;
    capacity: number | null;
    currentWaitlist: number;
    youtubeUrl: string | null;
    mapLat: number | null;
    mapLng: number | null;
    mapZoom: number | null;
    mapAddress: string | null;
    ownerId: string;
    venueId: string | null;
    categoryId: string | null;
    isPublic: boolean;
    featured: boolean;
    tags: string[];
    metadata: JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: EventCountAggregateOutputType | null;
    _avg: EventAvgAggregateOutputType | null;
    _sum: EventSumAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
  };

  type GetEventGroupByPayload<T extends EventGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<EventGroupByOutputType, T['by']> & {
          [P in keyof T & keyof EventGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>;
        }
      >
    >;

  export type EventSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      slug?: boolean;
      description?: boolean;
      shortDescription?: boolean;
      status?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      capacity?: boolean;
      currentWaitlist?: boolean;
      youtubeUrl?: boolean;
      mapLat?: boolean;
      mapLng?: boolean;
      mapZoom?: boolean;
      mapAddress?: boolean;
      ownerId?: boolean;
      venueId?: boolean;
      categoryId?: boolean;
      isPublic?: boolean;
      featured?: boolean;
      tags?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
      venue?: boolean | Event$venueArgs<ExtArgs>;
      category?: boolean | Event$categoryArgs<ExtArgs>;
      waitlist?: boolean | Event$waitlistArgs<ExtArgs>;
      shows?: boolean | Event$showsArgs<ExtArgs>;
      nearbyPlaces?: boolean | Event$nearbyPlacesArgs<ExtArgs>;
      _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['event']
  >;

  export type EventSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      slug?: boolean;
      description?: boolean;
      shortDescription?: boolean;
      status?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      capacity?: boolean;
      currentWaitlist?: boolean;
      youtubeUrl?: boolean;
      mapLat?: boolean;
      mapLng?: boolean;
      mapZoom?: boolean;
      mapAddress?: boolean;
      ownerId?: boolean;
      venueId?: boolean;
      categoryId?: boolean;
      isPublic?: boolean;
      featured?: boolean;
      tags?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      owner?: boolean | UserDefaultArgs<ExtArgs>;
      venue?: boolean | Event$venueArgs<ExtArgs>;
      category?: boolean | Event$categoryArgs<ExtArgs>;
    },
    ExtArgs['result']['event']
  >;

  export type EventSelectScalar = {
    id?: boolean;
    title?: boolean;
    slug?: boolean;
    description?: boolean;
    shortDescription?: boolean;
    status?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    capacity?: boolean;
    currentWaitlist?: boolean;
    youtubeUrl?: boolean;
    mapLat?: boolean;
    mapLng?: boolean;
    mapZoom?: boolean;
    mapAddress?: boolean;
    ownerId?: boolean;
    venueId?: boolean;
    categoryId?: boolean;
    isPublic?: boolean;
    featured?: boolean;
    tags?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type EventInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    venue?: boolean | Event$venueArgs<ExtArgs>;
    category?: boolean | Event$categoryArgs<ExtArgs>;
    waitlist?: boolean | Event$waitlistArgs<ExtArgs>;
    shows?: boolean | Event$showsArgs<ExtArgs>;
    nearbyPlaces?: boolean | Event$nearbyPlacesArgs<ExtArgs>;
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type EventIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    owner?: boolean | UserDefaultArgs<ExtArgs>;
    venue?: boolean | Event$venueArgs<ExtArgs>;
    category?: boolean | Event$categoryArgs<ExtArgs>;
  };

  export type $EventPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Event';
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>;
      venue: Prisma.$VenuePayload<ExtArgs> | null;
      category: Prisma.$CategoryPayload<ExtArgs> | null;
      waitlist: Prisma.$WaitlistEntryPayload<ExtArgs>[];
      shows: Prisma.$ShowPayload<ExtArgs>[];
      nearbyPlaces: Prisma.$NearbyPlacePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        shortDescription: string | null;
        status: $Enums.EventStatus;
        startDate: Date;
        endDate: Date | null;
        capacity: number | null;
        currentWaitlist: number;
        youtubeUrl: string | null;
        mapLat: number | null;
        mapLng: number | null;
        mapZoom: number | null;
        mapAddress: string | null;
        ownerId: string;
        venueId: string | null;
        categoryId: string | null;
        isPublic: boolean;
        featured: boolean;
        tags: string[];
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['event']
    >;
    composites: {};
  };

  type EventGetPayload<
    S extends boolean | null | undefined | EventDefaultArgs,
  > = $Result.GetResult<Prisma.$EventPayload, S>;

  type EventCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<EventFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: EventCountAggregateInputType | true;
  };

  export interface EventDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Event'];
      meta: { name: 'Event' };
    };
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(
      args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(
      args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     *
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EventFindManyArgs>(
      args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     *
     */
    create<T extends EventCreateArgs>(
      args: SelectSubset<T, EventCreateArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EventCreateManyArgs>(
      args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     *
     */
    delete<T extends EventDeleteArgs>(
      args: SelectSubset<T, EventDeleteArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EventUpdateArgs>(
      args: SelectSubset<T, EventUpdateArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EventDeleteManyArgs>(
      args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EventUpdateManyArgs>(
      args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(
      args: SelectSubset<T, EventUpsertArgs<ExtArgs>>
    ): Prisma__EventClient<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
     **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EventAggregateArgs>(
      args: Subset<T, EventAggregateArgs>
    ): Prisma.PrismaPromise<GetEventAggregateType<T>>;

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetEventGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Event model
     */
    readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    venue<T extends Event$venueArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$venueArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<
        Prisma.$VenuePayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    category<T extends Event$categoryArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$categoryArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    waitlist<T extends Event$waitlistArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$waitlistArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    shows<T extends Event$showsArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$showsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    nearbyPlaces<T extends Event$nearbyPlacesArgs<ExtArgs> = {}>(
      args?: Subset<T, Event$nearbyPlacesArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<Prisma.$NearbyPlacePayload<ExtArgs>, T, 'findMany'>
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<'Event', 'String'>;
    readonly title: FieldRef<'Event', 'String'>;
    readonly slug: FieldRef<'Event', 'String'>;
    readonly description: FieldRef<'Event', 'String'>;
    readonly shortDescription: FieldRef<'Event', 'String'>;
    readonly status: FieldRef<'Event', 'EventStatus'>;
    readonly startDate: FieldRef<'Event', 'DateTime'>;
    readonly endDate: FieldRef<'Event', 'DateTime'>;
    readonly capacity: FieldRef<'Event', 'Int'>;
    readonly currentWaitlist: FieldRef<'Event', 'Int'>;
    readonly youtubeUrl: FieldRef<'Event', 'String'>;
    readonly mapLat: FieldRef<'Event', 'Float'>;
    readonly mapLng: FieldRef<'Event', 'Float'>;
    readonly mapZoom: FieldRef<'Event', 'Int'>;
    readonly mapAddress: FieldRef<'Event', 'String'>;
    readonly ownerId: FieldRef<'Event', 'String'>;
    readonly venueId: FieldRef<'Event', 'String'>;
    readonly categoryId: FieldRef<'Event', 'String'>;
    readonly isPublic: FieldRef<'Event', 'Boolean'>;
    readonly featured: FieldRef<'Event', 'Boolean'>;
    readonly tags: FieldRef<'Event', 'String[]'>;
    readonly metadata: FieldRef<'Event', 'Json'>;
    readonly createdAt: FieldRef<'Event', 'DateTime'>;
    readonly updatedAt: FieldRef<'Event', 'DateTime'>;
    readonly deletedAt: FieldRef<'Event', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Event findMany
   */
  export type EventFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Events from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Events.
     */
    skip?: number;
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Event create
   */
  export type EventCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>;
  };

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Event update
   */
  export type EventUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>;
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>;
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput;
  };

  /**
   * Event upsert
   */
  export type EventUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput;
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>;
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>;
  };

  /**
   * Event delete
   */
  export type EventDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput;
  };

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput;
  };

  /**
   * Event.venue
   */
  export type Event$venueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    where?: VenueWhereInput;
  };

  /**
   * Event.category
   */
  export type Event$categoryArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    where?: CategoryWhereInput;
  };

  /**
   * Event.waitlist
   */
  export type Event$waitlistArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    where?: WaitlistEntryWhereInput;
    orderBy?:
      | WaitlistEntryOrderByWithRelationInput
      | WaitlistEntryOrderByWithRelationInput[];
    cursor?: WaitlistEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[];
  };

  /**
   * Event.shows
   */
  export type Event$showsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    where?: ShowWhereInput;
    orderBy?: ShowOrderByWithRelationInput | ShowOrderByWithRelationInput[];
    cursor?: ShowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ShowScalarFieldEnum | ShowScalarFieldEnum[];
  };

  /**
   * Event.nearbyPlaces
   */
  export type Event$nearbyPlacesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    where?: NearbyPlaceWhereInput;
    orderBy?:
      | NearbyPlaceOrderByWithRelationInput
      | NearbyPlaceOrderByWithRelationInput[];
    cursor?: NearbyPlaceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: NearbyPlaceScalarFieldEnum | NearbyPlaceScalarFieldEnum[];
  };

  /**
   * Event without action
   */
  export type EventDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
  };

  /**
   * Model Venue
   */

  export type AggregateVenue = {
    _count: VenueCountAggregateOutputType | null;
    _avg: VenueAvgAggregateOutputType | null;
    _sum: VenueSumAggregateOutputType | null;
    _min: VenueMinAggregateOutputType | null;
    _max: VenueMaxAggregateOutputType | null;
  };

  export type VenueAvgAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
  };

  export type VenueSumAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
  };

  export type VenueMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
    website: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type VenueMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
    website: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type VenueCountAggregateOutputType = {
    id: number;
    name: number;
    address: number;
    city: number;
    country: number;
    latitude: number;
    longitude: number;
    website: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type VenueAvgAggregateInputType = {
    latitude?: true;
    longitude?: true;
  };

  export type VenueSumAggregateInputType = {
    latitude?: true;
    longitude?: true;
  };

  export type VenueMinAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    city?: true;
    country?: true;
    latitude?: true;
    longitude?: true;
    website?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type VenueMaxAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    city?: true;
    country?: true;
    latitude?: true;
    longitude?: true;
    website?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type VenueCountAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    city?: true;
    country?: true;
    latitude?: true;
    longitude?: true;
    website?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type VenueAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Venue to aggregate.
     */
    where?: VenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: VenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Venues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Venues
     **/
    _count?: true | VenueCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: VenueAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: VenueSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: VenueMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: VenueMaxAggregateInputType;
  };

  export type GetVenueAggregateType<T extends VenueAggregateArgs> = {
    [P in keyof T & keyof AggregateVenue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVenue[P]>
      : GetScalarType<T[P], AggregateVenue[P]>;
  };

  export type VenueGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: VenueWhereInput;
    orderBy?:
      | VenueOrderByWithAggregationInput
      | VenueOrderByWithAggregationInput[];
    by: VenueScalarFieldEnum[] | VenueScalarFieldEnum;
    having?: VenueScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VenueCountAggregateInputType | true;
    _avg?: VenueAvgAggregateInputType;
    _sum?: VenueSumAggregateInputType;
    _min?: VenueMinAggregateInputType;
    _max?: VenueMaxAggregateInputType;
  };

  export type VenueGroupByOutputType = {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    website: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: VenueCountAggregateOutputType | null;
    _avg: VenueAvgAggregateOutputType | null;
    _sum: VenueSumAggregateOutputType | null;
    _min: VenueMinAggregateOutputType | null;
    _max: VenueMaxAggregateOutputType | null;
  };

  type GetVenueGroupByPayload<T extends VenueGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<VenueGroupByOutputType, T['by']> & {
          [P in keyof T & keyof VenueGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VenueGroupByOutputType[P]>
            : GetScalarType<T[P], VenueGroupByOutputType[P]>;
        }
      >
    >;

  export type VenueSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      city?: boolean;
      country?: boolean;
      latitude?: boolean;
      longitude?: boolean;
      website?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      events?: boolean | Venue$eventsArgs<ExtArgs>;
      _count?: boolean | VenueCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['venue']
  >;

  export type VenueSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      city?: boolean;
      country?: boolean;
      latitude?: boolean;
      longitude?: boolean;
      website?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
    },
    ExtArgs['result']['venue']
  >;

  export type VenueSelectScalar = {
    id?: boolean;
    name?: boolean;
    address?: boolean;
    city?: boolean;
    country?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    website?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type VenueInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    events?: boolean | Venue$eventsArgs<ExtArgs>;
    _count?: boolean | VenueCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type VenueIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $VenuePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Venue';
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        address: string;
        city: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
        website: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['venue']
    >;
    composites: {};
  };

  type VenueGetPayload<
    S extends boolean | null | undefined | VenueDefaultArgs,
  > = $Result.GetResult<Prisma.$VenuePayload, S>;

  type VenueCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<VenueFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: VenueCountAggregateInputType | true;
  };

  export interface VenueDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Venue'];
      meta: { name: 'Venue' };
    };
    /**
     * Find zero or one Venue that matches the filter.
     * @param {VenueFindUniqueArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VenueFindUniqueArgs>(
      args: SelectSubset<T, VenueFindUniqueArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Venue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VenueFindUniqueOrThrowArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VenueFindUniqueOrThrowArgs>(
      args: SelectSubset<T, VenueFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Venue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueFindFirstArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VenueFindFirstArgs>(
      args?: SelectSubset<T, VenueFindFirstArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Venue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueFindFirstOrThrowArgs} args - Arguments to find a Venue
     * @example
     * // Get one Venue
     * const venue = await prisma.venue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VenueFindFirstOrThrowArgs>(
      args?: SelectSubset<T, VenueFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Venues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Venues
     * const venues = await prisma.venue.findMany()
     *
     * // Get first 10 Venues
     * const venues = await prisma.venue.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const venueWithIdOnly = await prisma.venue.findMany({ select: { id: true } })
     *
     */
    findMany<T extends VenueFindManyArgs>(
      args?: SelectSubset<T, VenueFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Venue.
     * @param {VenueCreateArgs} args - Arguments to create a Venue.
     * @example
     * // Create one Venue
     * const Venue = await prisma.venue.create({
     *   data: {
     *     // ... data to create a Venue
     *   }
     * })
     *
     */
    create<T extends VenueCreateArgs>(
      args: SelectSubset<T, VenueCreateArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Venues.
     * @param {VenueCreateManyArgs} args - Arguments to create many Venues.
     * @example
     * // Create many Venues
     * const venue = await prisma.venue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends VenueCreateManyArgs>(
      args?: SelectSubset<T, VenueCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Venues and returns the data saved in the database.
     * @param {VenueCreateManyAndReturnArgs} args - Arguments to create many Venues.
     * @example
     * // Create many Venues
     * const venue = await prisma.venue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Venues and only return the `id`
     * const venueWithIdOnly = await prisma.venue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends VenueCreateManyAndReturnArgs>(
      args?: SelectSubset<T, VenueCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Venue.
     * @param {VenueDeleteArgs} args - Arguments to delete one Venue.
     * @example
     * // Delete one Venue
     * const Venue = await prisma.venue.delete({
     *   where: {
     *     // ... filter to delete one Venue
     *   }
     * })
     *
     */
    delete<T extends VenueDeleteArgs>(
      args: SelectSubset<T, VenueDeleteArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Venue.
     * @param {VenueUpdateArgs} args - Arguments to update one Venue.
     * @example
     * // Update one Venue
     * const venue = await prisma.venue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends VenueUpdateArgs>(
      args: SelectSubset<T, VenueUpdateArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Venues.
     * @param {VenueDeleteManyArgs} args - Arguments to filter Venues to delete.
     * @example
     * // Delete a few Venues
     * const { count } = await prisma.venue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends VenueDeleteManyArgs>(
      args?: SelectSubset<T, VenueDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Venues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Venues
     * const venue = await prisma.venue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends VenueUpdateManyArgs>(
      args: SelectSubset<T, VenueUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Venue.
     * @param {VenueUpsertArgs} args - Arguments to update or create a Venue.
     * @example
     * // Update or create a Venue
     * const venue = await prisma.venue.upsert({
     *   create: {
     *     // ... data to create a Venue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Venue we want to update
     *   }
     * })
     */
    upsert<T extends VenueUpsertArgs>(
      args: SelectSubset<T, VenueUpsertArgs<ExtArgs>>
    ): Prisma__VenueClient<
      $Result.GetResult<Prisma.$VenuePayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Venues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueCountArgs} args - Arguments to filter Venues to count.
     * @example
     * // Count the number of Venues
     * const count = await prisma.venue.count({
     *   where: {
     *     // ... the filter for the Venues we want to count
     *   }
     * })
     **/
    count<T extends VenueCountArgs>(
      args?: Subset<T, VenueCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VenueCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Venue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends VenueAggregateArgs>(
      args: Subset<T, VenueAggregateArgs>
    ): Prisma.PrismaPromise<GetVenueAggregateType<T>>;

    /**
     * Group by Venue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VenueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends VenueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VenueGroupByArgs['orderBy'] }
        : { orderBy?: VenueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, VenueGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetVenueGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Venue model
     */
    readonly fields: VenueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Venue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VenueClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    events<T extends Venue$eventsArgs<ExtArgs> = {}>(
      args?: Subset<T, Venue$eventsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Venue model
   */
  interface VenueFieldRefs {
    readonly id: FieldRef<'Venue', 'String'>;
    readonly name: FieldRef<'Venue', 'String'>;
    readonly address: FieldRef<'Venue', 'String'>;
    readonly city: FieldRef<'Venue', 'String'>;
    readonly country: FieldRef<'Venue', 'String'>;
    readonly latitude: FieldRef<'Venue', 'Float'>;
    readonly longitude: FieldRef<'Venue', 'Float'>;
    readonly website: FieldRef<'Venue', 'String'>;
    readonly createdAt: FieldRef<'Venue', 'DateTime'>;
    readonly updatedAt: FieldRef<'Venue', 'DateTime'>;
    readonly deletedAt: FieldRef<'Venue', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Venue findUnique
   */
  export type VenueFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * Filter, which Venue to fetch.
     */
    where: VenueWhereUniqueInput;
  };

  /**
   * Venue findUniqueOrThrow
   */
  export type VenueFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * Filter, which Venue to fetch.
     */
    where: VenueWhereUniqueInput;
  };

  /**
   * Venue findFirst
   */
  export type VenueFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * Filter, which Venue to fetch.
     */
    where?: VenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Venues.
     */
    cursor?: VenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Venues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Venues.
     */
    distinct?: VenueScalarFieldEnum | VenueScalarFieldEnum[];
  };

  /**
   * Venue findFirstOrThrow
   */
  export type VenueFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * Filter, which Venue to fetch.
     */
    where?: VenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Venues.
     */
    cursor?: VenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Venues.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Venues.
     */
    distinct?: VenueScalarFieldEnum | VenueScalarFieldEnum[];
  };

  /**
   * Venue findMany
   */
  export type VenueFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * Filter, which Venues to fetch.
     */
    where?: VenueWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Venues to fetch.
     */
    orderBy?: VenueOrderByWithRelationInput | VenueOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Venues.
     */
    cursor?: VenueWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Venues from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Venues.
     */
    skip?: number;
    distinct?: VenueScalarFieldEnum | VenueScalarFieldEnum[];
  };

  /**
   * Venue create
   */
  export type VenueCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * The data needed to create a Venue.
     */
    data: XOR<VenueCreateInput, VenueUncheckedCreateInput>;
  };

  /**
   * Venue createMany
   */
  export type VenueCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Venues.
     */
    data: VenueCreateManyInput | VenueCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Venue createManyAndReturn
   */
  export type VenueCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Venues.
     */
    data: VenueCreateManyInput | VenueCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Venue update
   */
  export type VenueUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * The data needed to update a Venue.
     */
    data: XOR<VenueUpdateInput, VenueUncheckedUpdateInput>;
    /**
     * Choose, which Venue to update.
     */
    where: VenueWhereUniqueInput;
  };

  /**
   * Venue updateMany
   */
  export type VenueUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Venues.
     */
    data: XOR<VenueUpdateManyMutationInput, VenueUncheckedUpdateManyInput>;
    /**
     * Filter which Venues to update
     */
    where?: VenueWhereInput;
  };

  /**
   * Venue upsert
   */
  export type VenueUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * The filter to search for the Venue to update in case it exists.
     */
    where: VenueWhereUniqueInput;
    /**
     * In case the Venue found by the `where` argument doesn't exist, create a new Venue with this data.
     */
    create: XOR<VenueCreateInput, VenueUncheckedCreateInput>;
    /**
     * In case the Venue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VenueUpdateInput, VenueUncheckedUpdateInput>;
  };

  /**
   * Venue delete
   */
  export type VenueDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
    /**
     * Filter which Venue to delete.
     */
    where: VenueWhereUniqueInput;
  };

  /**
   * Venue deleteMany
   */
  export type VenueDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Venues to delete
     */
    where?: VenueWhereInput;
  };

  /**
   * Venue.events
   */
  export type Venue$eventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    where?: EventWhereInput;
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    cursor?: EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Venue without action
   */
  export type VenueDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Venue
     */
    select?: VenueSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VenueInclude<ExtArgs> | null;
  };

  /**
   * Model WaitlistEntry
   */

  export type AggregateWaitlistEntry = {
    _count: WaitlistEntryCountAggregateOutputType | null;
    _min: WaitlistEntryMinAggregateOutputType | null;
    _max: WaitlistEntryMaxAggregateOutputType | null;
  };

  export type WaitlistEntryMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    eventId: string | null;
    userId: string | null;
    status: $Enums.WaitlistStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type WaitlistEntryMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    eventId: string | null;
    userId: string | null;
    status: $Enums.WaitlistStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type WaitlistEntryCountAggregateOutputType = {
    id: number;
    email: number;
    eventId: number;
    userId: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type WaitlistEntryMinAggregateInputType = {
    id?: true;
    email?: true;
    eventId?: true;
    userId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type WaitlistEntryMaxAggregateInputType = {
    id?: true;
    email?: true;
    eventId?: true;
    userId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type WaitlistEntryCountAggregateInputType = {
    id?: true;
    email?: true;
    eventId?: true;
    userId?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type WaitlistEntryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WaitlistEntry to aggregate.
     */
    where?: WaitlistEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?:
      | WaitlistEntryOrderByWithRelationInput
      | WaitlistEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: WaitlistEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned WaitlistEntries
     **/
    _count?: true | WaitlistEntryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: WaitlistEntryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: WaitlistEntryMaxAggregateInputType;
  };

  export type GetWaitlistEntryAggregateType<
    T extends WaitlistEntryAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateWaitlistEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWaitlistEntry[P]>
      : GetScalarType<T[P], AggregateWaitlistEntry[P]>;
  };

  export type WaitlistEntryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: WaitlistEntryWhereInput;
    orderBy?:
      | WaitlistEntryOrderByWithAggregationInput
      | WaitlistEntryOrderByWithAggregationInput[];
    by: WaitlistEntryScalarFieldEnum[] | WaitlistEntryScalarFieldEnum;
    having?: WaitlistEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WaitlistEntryCountAggregateInputType | true;
    _min?: WaitlistEntryMinAggregateInputType;
    _max?: WaitlistEntryMaxAggregateInputType;
  };

  export type WaitlistEntryGroupByOutputType = {
    id: string;
    email: string;
    eventId: string;
    userId: string | null;
    status: $Enums.WaitlistStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: WaitlistEntryCountAggregateOutputType | null;
    _min: WaitlistEntryMinAggregateOutputType | null;
    _max: WaitlistEntryMaxAggregateOutputType | null;
  };

  type GetWaitlistEntryGroupByPayload<T extends WaitlistEntryGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<WaitlistEntryGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof WaitlistEntryGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WaitlistEntryGroupByOutputType[P]>
            : GetScalarType<T[P], WaitlistEntryGroupByOutputType[P]>;
        }
      >
    >;

  export type WaitlistEntrySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      eventId?: boolean;
      userId?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      event?: boolean | EventDefaultArgs<ExtArgs>;
      user?: boolean | WaitlistEntry$userArgs<ExtArgs>;
    },
    ExtArgs['result']['waitlistEntry']
  >;

  export type WaitlistEntrySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      eventId?: boolean;
      userId?: boolean;
      status?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      event?: boolean | EventDefaultArgs<ExtArgs>;
      user?: boolean | WaitlistEntry$userArgs<ExtArgs>;
    },
    ExtArgs['result']['waitlistEntry']
  >;

  export type WaitlistEntrySelectScalar = {
    id?: boolean;
    email?: boolean;
    eventId?: boolean;
    userId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type WaitlistEntryInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>;
    user?: boolean | WaitlistEntry$userArgs<ExtArgs>;
  };
  export type WaitlistEntryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>;
    user?: boolean | WaitlistEntry$userArgs<ExtArgs>;
  };

  export type $WaitlistEntryPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'WaitlistEntry';
    objects: {
      event: Prisma.$EventPayload<ExtArgs>;
      user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        eventId: string;
        userId: string | null;
        status: $Enums.WaitlistStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['waitlistEntry']
    >;
    composites: {};
  };

  type WaitlistEntryGetPayload<
    S extends boolean | null | undefined | WaitlistEntryDefaultArgs,
  > = $Result.GetResult<Prisma.$WaitlistEntryPayload, S>;

  type WaitlistEntryCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<WaitlistEntryFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: WaitlistEntryCountAggregateInputType | true;
  };

  export interface WaitlistEntryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['WaitlistEntry'];
      meta: { name: 'WaitlistEntry' };
    };
    /**
     * Find zero or one WaitlistEntry that matches the filter.
     * @param {WaitlistEntryFindUniqueArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WaitlistEntryFindUniqueArgs>(
      args: SelectSubset<T, WaitlistEntryFindUniqueArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<
        Prisma.$WaitlistEntryPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one WaitlistEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WaitlistEntryFindUniqueOrThrowArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WaitlistEntryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, WaitlistEntryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<
        Prisma.$WaitlistEntryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first WaitlistEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryFindFirstArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WaitlistEntryFindFirstArgs>(
      args?: SelectSubset<T, WaitlistEntryFindFirstArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<
        Prisma.$WaitlistEntryPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first WaitlistEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryFindFirstOrThrowArgs} args - Arguments to find a WaitlistEntry
     * @example
     * // Get one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WaitlistEntryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, WaitlistEntryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<
        Prisma.$WaitlistEntryPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more WaitlistEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WaitlistEntries
     * const waitlistEntries = await prisma.waitlistEntry.findMany()
     *
     * // Get first 10 WaitlistEntries
     * const waitlistEntries = await prisma.waitlistEntry.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const waitlistEntryWithIdOnly = await prisma.waitlistEntry.findMany({ select: { id: true } })
     *
     */
    findMany<T extends WaitlistEntryFindManyArgs>(
      args?: SelectSubset<T, WaitlistEntryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a WaitlistEntry.
     * @param {WaitlistEntryCreateArgs} args - Arguments to create a WaitlistEntry.
     * @example
     * // Create one WaitlistEntry
     * const WaitlistEntry = await prisma.waitlistEntry.create({
     *   data: {
     *     // ... data to create a WaitlistEntry
     *   }
     * })
     *
     */
    create<T extends WaitlistEntryCreateArgs>(
      args: SelectSubset<T, WaitlistEntryCreateArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many WaitlistEntries.
     * @param {WaitlistEntryCreateManyArgs} args - Arguments to create many WaitlistEntries.
     * @example
     * // Create many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends WaitlistEntryCreateManyArgs>(
      args?: SelectSubset<T, WaitlistEntryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many WaitlistEntries and returns the data saved in the database.
     * @param {WaitlistEntryCreateManyAndReturnArgs} args - Arguments to create many WaitlistEntries.
     * @example
     * // Create many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many WaitlistEntries and only return the `id`
     * const waitlistEntryWithIdOnly = await prisma.waitlistEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends WaitlistEntryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, WaitlistEntryCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$WaitlistEntryPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a WaitlistEntry.
     * @param {WaitlistEntryDeleteArgs} args - Arguments to delete one WaitlistEntry.
     * @example
     * // Delete one WaitlistEntry
     * const WaitlistEntry = await prisma.waitlistEntry.delete({
     *   where: {
     *     // ... filter to delete one WaitlistEntry
     *   }
     * })
     *
     */
    delete<T extends WaitlistEntryDeleteArgs>(
      args: SelectSubset<T, WaitlistEntryDeleteArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one WaitlistEntry.
     * @param {WaitlistEntryUpdateArgs} args - Arguments to update one WaitlistEntry.
     * @example
     * // Update one WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends WaitlistEntryUpdateArgs>(
      args: SelectSubset<T, WaitlistEntryUpdateArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more WaitlistEntries.
     * @param {WaitlistEntryDeleteManyArgs} args - Arguments to filter WaitlistEntries to delete.
     * @example
     * // Delete a few WaitlistEntries
     * const { count } = await prisma.waitlistEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends WaitlistEntryDeleteManyArgs>(
      args?: SelectSubset<T, WaitlistEntryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more WaitlistEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WaitlistEntries
     * const waitlistEntry = await prisma.waitlistEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends WaitlistEntryUpdateManyArgs>(
      args: SelectSubset<T, WaitlistEntryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one WaitlistEntry.
     * @param {WaitlistEntryUpsertArgs} args - Arguments to update or create a WaitlistEntry.
     * @example
     * // Update or create a WaitlistEntry
     * const waitlistEntry = await prisma.waitlistEntry.upsert({
     *   create: {
     *     // ... data to create a WaitlistEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WaitlistEntry we want to update
     *   }
     * })
     */
    upsert<T extends WaitlistEntryUpsertArgs>(
      args: SelectSubset<T, WaitlistEntryUpsertArgs<ExtArgs>>
    ): Prisma__WaitlistEntryClient<
      $Result.GetResult<Prisma.$WaitlistEntryPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of WaitlistEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryCountArgs} args - Arguments to filter WaitlistEntries to count.
     * @example
     * // Count the number of WaitlistEntries
     * const count = await prisma.waitlistEntry.count({
     *   where: {
     *     // ... the filter for the WaitlistEntries we want to count
     *   }
     * })
     **/
    count<T extends WaitlistEntryCountArgs>(
      args?: Subset<T, WaitlistEntryCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WaitlistEntryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a WaitlistEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends WaitlistEntryAggregateArgs>(
      args: Subset<T, WaitlistEntryAggregateArgs>
    ): Prisma.PrismaPromise<GetWaitlistEntryAggregateType<T>>;

    /**
     * Group by WaitlistEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaitlistEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends WaitlistEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WaitlistEntryGroupByArgs['orderBy'] }
        : { orderBy?: WaitlistEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, WaitlistEntryGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetWaitlistEntryGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the WaitlistEntry model
     */
    readonly fields: WaitlistEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WaitlistEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WaitlistEntryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>
    ): Prisma__EventClient<
      | $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    user<T extends WaitlistEntry$userArgs<ExtArgs> = {}>(
      args?: Subset<T, WaitlistEntry$userArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the WaitlistEntry model
   */
  interface WaitlistEntryFieldRefs {
    readonly id: FieldRef<'WaitlistEntry', 'String'>;
    readonly email: FieldRef<'WaitlistEntry', 'String'>;
    readonly eventId: FieldRef<'WaitlistEntry', 'String'>;
    readonly userId: FieldRef<'WaitlistEntry', 'String'>;
    readonly status: FieldRef<'WaitlistEntry', 'WaitlistStatus'>;
    readonly createdAt: FieldRef<'WaitlistEntry', 'DateTime'>;
    readonly updatedAt: FieldRef<'WaitlistEntry', 'DateTime'>;
    readonly deletedAt: FieldRef<'WaitlistEntry', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * WaitlistEntry findUnique
   */
  export type WaitlistEntryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where: WaitlistEntryWhereUniqueInput;
  };

  /**
   * WaitlistEntry findUniqueOrThrow
   */
  export type WaitlistEntryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where: WaitlistEntryWhereUniqueInput;
  };

  /**
   * WaitlistEntry findFirst
   */
  export type WaitlistEntryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where?: WaitlistEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?:
      | WaitlistEntryOrderByWithRelationInput
      | WaitlistEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WaitlistEntries.
     */
    cursor?: WaitlistEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WaitlistEntries.
     */
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[];
  };

  /**
   * WaitlistEntry findFirstOrThrow
   */
  export type WaitlistEntryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * Filter, which WaitlistEntry to fetch.
     */
    where?: WaitlistEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?:
      | WaitlistEntryOrderByWithRelationInput
      | WaitlistEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for WaitlistEntries.
     */
    cursor?: WaitlistEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of WaitlistEntries.
     */
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[];
  };

  /**
   * WaitlistEntry findMany
   */
  export type WaitlistEntryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * Filter, which WaitlistEntries to fetch.
     */
    where?: WaitlistEntryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of WaitlistEntries to fetch.
     */
    orderBy?:
      | WaitlistEntryOrderByWithRelationInput
      | WaitlistEntryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing WaitlistEntries.
     */
    cursor?: WaitlistEntryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` WaitlistEntries from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` WaitlistEntries.
     */
    skip?: number;
    distinct?: WaitlistEntryScalarFieldEnum | WaitlistEntryScalarFieldEnum[];
  };

  /**
   * WaitlistEntry create
   */
  export type WaitlistEntryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * The data needed to create a WaitlistEntry.
     */
    data: XOR<WaitlistEntryCreateInput, WaitlistEntryUncheckedCreateInput>;
  };

  /**
   * WaitlistEntry createMany
   */
  export type WaitlistEntryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many WaitlistEntries.
     */
    data: WaitlistEntryCreateManyInput | WaitlistEntryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * WaitlistEntry createManyAndReturn
   */
  export type WaitlistEntryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many WaitlistEntries.
     */
    data: WaitlistEntryCreateManyInput | WaitlistEntryCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * WaitlistEntry update
   */
  export type WaitlistEntryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * The data needed to update a WaitlistEntry.
     */
    data: XOR<WaitlistEntryUpdateInput, WaitlistEntryUncheckedUpdateInput>;
    /**
     * Choose, which WaitlistEntry to update.
     */
    where: WaitlistEntryWhereUniqueInput;
  };

  /**
   * WaitlistEntry updateMany
   */
  export type WaitlistEntryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update WaitlistEntries.
     */
    data: XOR<
      WaitlistEntryUpdateManyMutationInput,
      WaitlistEntryUncheckedUpdateManyInput
    >;
    /**
     * Filter which WaitlistEntries to update
     */
    where?: WaitlistEntryWhereInput;
  };

  /**
   * WaitlistEntry upsert
   */
  export type WaitlistEntryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * The filter to search for the WaitlistEntry to update in case it exists.
     */
    where: WaitlistEntryWhereUniqueInput;
    /**
     * In case the WaitlistEntry found by the `where` argument doesn't exist, create a new WaitlistEntry with this data.
     */
    create: XOR<WaitlistEntryCreateInput, WaitlistEntryUncheckedCreateInput>;
    /**
     * In case the WaitlistEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WaitlistEntryUpdateInput, WaitlistEntryUncheckedUpdateInput>;
  };

  /**
   * WaitlistEntry delete
   */
  export type WaitlistEntryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
    /**
     * Filter which WaitlistEntry to delete.
     */
    where: WaitlistEntryWhereUniqueInput;
  };

  /**
   * WaitlistEntry deleteMany
   */
  export type WaitlistEntryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which WaitlistEntries to delete
     */
    where?: WaitlistEntryWhereInput;
  };

  /**
   * WaitlistEntry.user
   */
  export type WaitlistEntry$userArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };

  /**
   * WaitlistEntry without action
   */
  export type WaitlistEntryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the WaitlistEntry
     */
    select?: WaitlistEntrySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaitlistEntryInclude<ExtArgs> | null;
  };

  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };

  export type SessionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    token: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type SessionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    token: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type SessionCountAggregateOutputType = {
    id: number;
    userId: number;
    token: number;
    expiresAt: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type SessionMinAggregateInputType = {
    id?: true;
    userId?: true;
    token?: true;
    expiresAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type SessionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    token?: true;
    expiresAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type SessionCountAggregateInputType = {
    id?: true;
    userId?: true;
    token?: true;
    expiresAt?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type SessionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Sessions
     **/
    _count?: true | SessionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SessionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SessionMaxAggregateInputType;
  };

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
    [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>;
  };

  export type SessionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: SessionWhereInput;
    orderBy?:
      | SessionOrderByWithAggregationInput
      | SessionOrderByWithAggregationInput[];
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum;
    having?: SessionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SessionCountAggregateInputType | true;
    _min?: SessionMinAggregateInputType;
    _max?: SessionMaxAggregateInputType;
  };

  export type SessionGroupByOutputType = {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: SessionCountAggregateOutputType | null;
    _min: SessionMinAggregateOutputType | null;
    _max: SessionMaxAggregateOutputType | null;
  };

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<SessionGroupByOutputType, T['by']> & {
          [P in keyof T & keyof SessionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>;
        }
      >
    >;

  export type SessionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;

  export type SessionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['session']
  >;

  export type SessionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type SessionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type SessionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $SessionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Session';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        token: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['session']
    >;
    composites: {};
  };

  type SessionGetPayload<
    S extends boolean | null | undefined | SessionDefaultArgs,
  > = $Result.GetResult<Prisma.$SessionPayload, S>;

  type SessionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: SessionCountAggregateInputType | true;
  };

  export interface SessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Session'];
      meta: { name: 'Session' };
    };
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(
      args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(
      args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     *
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SessionFindManyArgs>(
      args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     *
     */
    create<T extends SessionCreateArgs>(
      args: SelectSubset<T, SessionCreateArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SessionCreateManyArgs>(
      args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$SessionPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     *
     */
    delete<T extends SessionDeleteArgs>(
      args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SessionUpdateArgs>(
      args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SessionDeleteManyArgs>(
      args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SessionUpdateManyArgs>(
      args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(
      args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>
    ): Prisma__SessionClient<
      $Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
     **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SessionAggregateArgs>(
      args: Subset<T, SessionAggregateArgs>
    ): Prisma.PrismaPromise<GetSessionAggregateType<T>>;

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetSessionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Session model
     */
    readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<'Session', 'String'>;
    readonly userId: FieldRef<'Session', 'String'>;
    readonly token: FieldRef<'Session', 'String'>;
    readonly expiresAt: FieldRef<'Session', 'DateTime'>;
    readonly createdAt: FieldRef<'Session', 'DateTime'>;
    readonly updatedAt: FieldRef<'Session', 'DateTime'>;
    readonly deletedAt: FieldRef<'Session', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Sessions to fetch.
     */
    orderBy?:
      | SessionOrderByWithRelationInput
      | SessionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Sessions.
     */
    skip?: number;
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[];
  };

  /**
   * Session create
   */
  export type SessionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
  };

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Session update
   */
  export type SessionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>;
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput;
  };

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput;
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>;
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>;
  };

  /**
   * Session delete
   */
  export type SessionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput;
  };

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput;
  };

  /**
   * Session without action
   */
  export type SessionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null;
  };

  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null;
    _min: AuditLogMinAggregateOutputType | null;
    _max: AuditLogMaxAggregateOutputType | null;
  };

  export type AuditLogMinAggregateOutputType = {
    id: string | null;
    action: string | null;
    resource: string | null;
    resourceId: string | null;
    userId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
  };

  export type AuditLogMaxAggregateOutputType = {
    id: string | null;
    action: string | null;
    resource: string | null;
    resourceId: string | null;
    userId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
  };

  export type AuditLogCountAggregateOutputType = {
    id: number;
    action: number;
    resource: number;
    resourceId: number;
    userId: number;
    ipAddress: number;
    userAgent: number;
    metadata: number;
    createdAt: number;
    _all: number;
  };

  export type AuditLogMinAggregateInputType = {
    id?: true;
    action?: true;
    resource?: true;
    resourceId?: true;
    userId?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
  };

  export type AuditLogMaxAggregateInputType = {
    id?: true;
    action?: true;
    resource?: true;
    resourceId?: true;
    userId?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
  };

  export type AuditLogCountAggregateInputType = {
    id?: true;
    action?: true;
    resource?: true;
    resourceId?: true;
    userId?: true;
    ipAddress?: true;
    userAgent?: true;
    metadata?: true;
    createdAt?: true;
    _all?: true;
  };

  export type AuditLogAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AuditLogs
     **/
    _count?: true | AuditLogCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AuditLogMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AuditLogMaxAggregateInputType;
  };

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>;
  };

  export type AuditLogGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AuditLogWhereInput;
    orderBy?:
      | AuditLogOrderByWithAggregationInput
      | AuditLogOrderByWithAggregationInput[];
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum;
    having?: AuditLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AuditLogCountAggregateInputType | true;
    _min?: AuditLogMinAggregateInputType;
    _max?: AuditLogMaxAggregateInputType;
  };

  export type AuditLogGroupByOutputType = {
    id: string;
    action: string;
    resource: string;
    resourceId: string;
    userId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    metadata: JsonValue | null;
    createdAt: Date;
    _count: AuditLogCountAggregateOutputType | null;
    _min: AuditLogMinAggregateOutputType | null;
    _max: AuditLogMaxAggregateOutputType | null;
  };

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AuditLogGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AuditLogGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>;
        }
      >
    >;

  export type AuditLogSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      action?: boolean;
      resource?: boolean;
      resourceId?: boolean;
      userId?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      user?: boolean | AuditLog$userArgs<ExtArgs>;
    },
    ExtArgs['result']['auditLog']
  >;

  export type AuditLogSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      action?: boolean;
      resource?: boolean;
      resourceId?: boolean;
      userId?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      user?: boolean | AuditLog$userArgs<ExtArgs>;
    },
    ExtArgs['result']['auditLog']
  >;

  export type AuditLogSelectScalar = {
    id?: boolean;
    action?: boolean;
    resource?: boolean;
    resourceId?: boolean;
    userId?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
  };

  export type AuditLogInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | AuditLog$userArgs<ExtArgs>;
  };
  export type AuditLogIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | AuditLog$userArgs<ExtArgs>;
  };

  export type $AuditLogPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'AuditLog';
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        action: string;
        resource: string;
        resourceId: string;
        userId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
      },
      ExtArgs['result']['auditLog']
    >;
    composites: {};
  };

  type AuditLogGetPayload<
    S extends boolean | null | undefined | AuditLogDefaultArgs,
  > = $Result.GetResult<Prisma.$AuditLogPayload, S>;

  type AuditLogCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: AuditLogCountAggregateInputType | true;
  };

  export interface AuditLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'];
      meta: { name: 'AuditLog' };
    };
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(
      args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(
      args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     *
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AuditLogFindManyArgs>(
      args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     *
     */
    create<T extends AuditLogCreateArgs>(
      args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AuditLogCreateManyArgs>(
      args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AuditLogPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     *
     */
    delete<T extends AuditLogDeleteArgs>(
      args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AuditLogUpdateArgs>(
      args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(
      args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AuditLogUpdateManyArgs>(
      args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(
      args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>
    ): Prisma__AuditLogClient<
      $Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
     **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AuditLogAggregateArgs>(
      args: Subset<T, AuditLogAggregateArgs>
    ): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>;

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetAuditLogGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AuditLog model
     */
    readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(
      args?: Subset<T, AuditLog$userArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<'AuditLog', 'String'>;
    readonly action: FieldRef<'AuditLog', 'String'>;
    readonly resource: FieldRef<'AuditLog', 'String'>;
    readonly resourceId: FieldRef<'AuditLog', 'String'>;
    readonly userId: FieldRef<'AuditLog', 'String'>;
    readonly ipAddress: FieldRef<'AuditLog', 'String'>;
    readonly userAgent: FieldRef<'AuditLog', 'String'>;
    readonly metadata: FieldRef<'AuditLog', 'Json'>;
    readonly createdAt: FieldRef<'AuditLog', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?:
      | AuditLogOrderByWithRelationInput
      | AuditLogOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AuditLogs.
     */
    skip?: number;
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[];
  };

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>;
  };

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>;
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<
      AuditLogUpdateManyMutationInput,
      AuditLogUncheckedUpdateManyInput
    >;
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput;
  };

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput;
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>;
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>;
  };

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput;
  };

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput;
  };

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null;
  };

  /**
   * Model Show
   */

  export type AggregateShow = {
    _count: ShowCountAggregateOutputType | null;
    _avg: ShowAvgAggregateOutputType | null;
    _sum: ShowSumAggregateOutputType | null;
    _min: ShowMinAggregateOutputType | null;
    _max: ShowMaxAggregateOutputType | null;
  };

  export type ShowAvgAggregateOutputType = {
    capacity: number | null;
    currentWaitlist: number | null;
  };

  export type ShowSumAggregateOutputType = {
    capacity: number | null;
    currentWaitlist: number | null;
  };

  export type ShowMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    startDate: Date | null;
    endDate: Date | null;
    capacity: number | null;
    currentWaitlist: number | null;
    youtubeUrl: string | null;
    eventId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type ShowMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    startDate: Date | null;
    endDate: Date | null;
    capacity: number | null;
    currentWaitlist: number | null;
    youtubeUrl: string | null;
    eventId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type ShowCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    startDate: number;
    endDate: number;
    capacity: number;
    currentWaitlist: number;
    youtubeUrl: number;
    eventId: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type ShowAvgAggregateInputType = {
    capacity?: true;
    currentWaitlist?: true;
  };

  export type ShowSumAggregateInputType = {
    capacity?: true;
    currentWaitlist?: true;
  };

  export type ShowMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    startDate?: true;
    endDate?: true;
    capacity?: true;
    currentWaitlist?: true;
    youtubeUrl?: true;
    eventId?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type ShowMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    startDate?: true;
    endDate?: true;
    capacity?: true;
    currentWaitlist?: true;
    youtubeUrl?: true;
    eventId?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type ShowCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    startDate?: true;
    endDate?: true;
    capacity?: true;
    currentWaitlist?: true;
    youtubeUrl?: true;
    eventId?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type ShowAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Show to aggregate.
     */
    where?: ShowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Shows to fetch.
     */
    orderBy?: ShowOrderByWithRelationInput | ShowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ShowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Shows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Shows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Shows
     **/
    _count?: true | ShowCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: ShowAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: ShowSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ShowMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ShowMaxAggregateInputType;
  };

  export type GetShowAggregateType<T extends ShowAggregateArgs> = {
    [P in keyof T & keyof AggregateShow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShow[P]>
      : GetScalarType<T[P], AggregateShow[P]>;
  };

  export type ShowGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ShowWhereInput;
    orderBy?:
      | ShowOrderByWithAggregationInput
      | ShowOrderByWithAggregationInput[];
    by: ShowScalarFieldEnum[] | ShowScalarFieldEnum;
    having?: ShowScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ShowCountAggregateInputType | true;
    _avg?: ShowAvgAggregateInputType;
    _sum?: ShowSumAggregateInputType;
    _min?: ShowMinAggregateInputType;
    _max?: ShowMaxAggregateInputType;
  };

  export type ShowGroupByOutputType = {
    id: string;
    title: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    capacity: number | null;
    currentWaitlist: number;
    youtubeUrl: string | null;
    eventId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: ShowCountAggregateOutputType | null;
    _avg: ShowAvgAggregateOutputType | null;
    _sum: ShowSumAggregateOutputType | null;
    _min: ShowMinAggregateOutputType | null;
    _max: ShowMaxAggregateOutputType | null;
  };

  type GetShowGroupByPayload<T extends ShowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShowGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ShowGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ShowGroupByOutputType[P]>
          : GetScalarType<T[P], ShowGroupByOutputType[P]>;
      }
    >
  >;

  export type ShowSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      capacity?: boolean;
      currentWaitlist?: boolean;
      youtubeUrl?: boolean;
      eventId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['show']
  >;

  export type ShowSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      title?: boolean;
      description?: boolean;
      startDate?: boolean;
      endDate?: boolean;
      capacity?: boolean;
      currentWaitlist?: boolean;
      youtubeUrl?: boolean;
      eventId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['show']
  >;

  export type ShowSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    capacity?: boolean;
    currentWaitlist?: boolean;
    youtubeUrl?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type ShowInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };
  export type ShowIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };

  export type $ShowPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Show';
    objects: {
      event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        title: string;
        description: string | null;
        startDate: Date;
        endDate: Date | null;
        capacity: number | null;
        currentWaitlist: number;
        youtubeUrl: string | null;
        eventId: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['show']
    >;
    composites: {};
  };

  type ShowGetPayload<S extends boolean | null | undefined | ShowDefaultArgs> =
    $Result.GetResult<Prisma.$ShowPayload, S>;

  type ShowCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ShowFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ShowCountAggregateInputType | true;
  };

  export interface ShowDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Show'];
      meta: { name: 'Show' };
    };
    /**
     * Find zero or one Show that matches the filter.
     * @param {ShowFindUniqueArgs} args - Arguments to find a Show
     * @example
     * // Get one Show
     * const show = await prisma.show.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShowFindUniqueArgs>(
      args: SelectSubset<T, ShowFindUniqueArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'findUnique'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Show that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShowFindUniqueOrThrowArgs} args - Arguments to find a Show
     * @example
     * // Get one Show
     * const show = await prisma.show.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShowFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ShowFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'findUniqueOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find the first Show that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowFindFirstArgs} args - Arguments to find a Show
     * @example
     * // Get one Show
     * const show = await prisma.show.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShowFindFirstArgs>(
      args?: SelectSubset<T, ShowFindFirstArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Show that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowFindFirstOrThrowArgs} args - Arguments to find a Show
     * @example
     * // Get one Show
     * const show = await prisma.show.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShowFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ShowFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Shows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shows
     * const shows = await prisma.show.findMany()
     *
     * // Get first 10 Shows
     * const shows = await prisma.show.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const showWithIdOnly = await prisma.show.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ShowFindManyArgs>(
      args?: SelectSubset<T, ShowFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Show.
     * @param {ShowCreateArgs} args - Arguments to create a Show.
     * @example
     * // Create one Show
     * const Show = await prisma.show.create({
     *   data: {
     *     // ... data to create a Show
     *   }
     * })
     *
     */
    create<T extends ShowCreateArgs>(
      args: SelectSubset<T, ShowCreateArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Shows.
     * @param {ShowCreateManyArgs} args - Arguments to create many Shows.
     * @example
     * // Create many Shows
     * const show = await prisma.show.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ShowCreateManyArgs>(
      args?: SelectSubset<T, ShowCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Shows and returns the data saved in the database.
     * @param {ShowCreateManyAndReturnArgs} args - Arguments to create many Shows.
     * @example
     * // Create many Shows
     * const show = await prisma.show.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Shows and only return the `id`
     * const showWithIdOnly = await prisma.show.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ShowCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ShowCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'createManyAndReturn'>
    >;

    /**
     * Delete a Show.
     * @param {ShowDeleteArgs} args - Arguments to delete one Show.
     * @example
     * // Delete one Show
     * const Show = await prisma.show.delete({
     *   where: {
     *     // ... filter to delete one Show
     *   }
     * })
     *
     */
    delete<T extends ShowDeleteArgs>(
      args: SelectSubset<T, ShowDeleteArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Show.
     * @param {ShowUpdateArgs} args - Arguments to update one Show.
     * @example
     * // Update one Show
     * const show = await prisma.show.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ShowUpdateArgs>(
      args: SelectSubset<T, ShowUpdateArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Shows.
     * @param {ShowDeleteManyArgs} args - Arguments to filter Shows to delete.
     * @example
     * // Delete a few Shows
     * const { count } = await prisma.show.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ShowDeleteManyArgs>(
      args?: SelectSubset<T, ShowDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Shows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shows
     * const show = await prisma.show.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ShowUpdateManyArgs>(
      args: SelectSubset<T, ShowUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Show.
     * @param {ShowUpsertArgs} args - Arguments to update or create a Show.
     * @example
     * // Update or create a Show
     * const show = await prisma.show.upsert({
     *   create: {
     *     // ... data to create a Show
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Show we want to update
     *   }
     * })
     */
    upsert<T extends ShowUpsertArgs>(
      args: SelectSubset<T, ShowUpsertArgs<ExtArgs>>
    ): Prisma__ShowClient<
      $Result.GetResult<Prisma.$ShowPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Shows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowCountArgs} args - Arguments to filter Shows to count.
     * @example
     * // Count the number of Shows
     * const count = await prisma.show.count({
     *   where: {
     *     // ... the filter for the Shows we want to count
     *   }
     * })
     **/
    count<T extends ShowCountArgs>(
      args?: Subset<T, ShowCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShowCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Show.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ShowAggregateArgs>(
      args: Subset<T, ShowAggregateArgs>
    ): Prisma.PrismaPromise<GetShowAggregateType<T>>;

    /**
     * Group by Show.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ShowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShowGroupByArgs['orderBy'] }
        : { orderBy?: ShowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ShowGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetShowGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Show model
     */
    readonly fields: ShowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Show.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShowClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>
    ): Prisma__EventClient<
      | $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Show model
   */
  interface ShowFieldRefs {
    readonly id: FieldRef<'Show', 'String'>;
    readonly title: FieldRef<'Show', 'String'>;
    readonly description: FieldRef<'Show', 'String'>;
    readonly startDate: FieldRef<'Show', 'DateTime'>;
    readonly endDate: FieldRef<'Show', 'DateTime'>;
    readonly capacity: FieldRef<'Show', 'Int'>;
    readonly currentWaitlist: FieldRef<'Show', 'Int'>;
    readonly youtubeUrl: FieldRef<'Show', 'String'>;
    readonly eventId: FieldRef<'Show', 'String'>;
    readonly createdAt: FieldRef<'Show', 'DateTime'>;
    readonly updatedAt: FieldRef<'Show', 'DateTime'>;
    readonly deletedAt: FieldRef<'Show', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Show findUnique
   */
  export type ShowFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * Filter, which Show to fetch.
     */
    where: ShowWhereUniqueInput;
  };

  /**
   * Show findUniqueOrThrow
   */
  export type ShowFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * Filter, which Show to fetch.
     */
    where: ShowWhereUniqueInput;
  };

  /**
   * Show findFirst
   */
  export type ShowFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * Filter, which Show to fetch.
     */
    where?: ShowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Shows to fetch.
     */
    orderBy?: ShowOrderByWithRelationInput | ShowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Shows.
     */
    cursor?: ShowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Shows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Shows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Shows.
     */
    distinct?: ShowScalarFieldEnum | ShowScalarFieldEnum[];
  };

  /**
   * Show findFirstOrThrow
   */
  export type ShowFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * Filter, which Show to fetch.
     */
    where?: ShowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Shows to fetch.
     */
    orderBy?: ShowOrderByWithRelationInput | ShowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Shows.
     */
    cursor?: ShowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Shows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Shows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Shows.
     */
    distinct?: ShowScalarFieldEnum | ShowScalarFieldEnum[];
  };

  /**
   * Show findMany
   */
  export type ShowFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * Filter, which Shows to fetch.
     */
    where?: ShowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Shows to fetch.
     */
    orderBy?: ShowOrderByWithRelationInput | ShowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Shows.
     */
    cursor?: ShowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Shows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Shows.
     */
    skip?: number;
    distinct?: ShowScalarFieldEnum | ShowScalarFieldEnum[];
  };

  /**
   * Show create
   */
  export type ShowCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * The data needed to create a Show.
     */
    data: XOR<ShowCreateInput, ShowUncheckedCreateInput>;
  };

  /**
   * Show createMany
   */
  export type ShowCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Shows.
     */
    data: ShowCreateManyInput | ShowCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Show createManyAndReturn
   */
  export type ShowCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Shows.
     */
    data: ShowCreateManyInput | ShowCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Show update
   */
  export type ShowUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * The data needed to update a Show.
     */
    data: XOR<ShowUpdateInput, ShowUncheckedUpdateInput>;
    /**
     * Choose, which Show to update.
     */
    where: ShowWhereUniqueInput;
  };

  /**
   * Show updateMany
   */
  export type ShowUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Shows.
     */
    data: XOR<ShowUpdateManyMutationInput, ShowUncheckedUpdateManyInput>;
    /**
     * Filter which Shows to update
     */
    where?: ShowWhereInput;
  };

  /**
   * Show upsert
   */
  export type ShowUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * The filter to search for the Show to update in case it exists.
     */
    where: ShowWhereUniqueInput;
    /**
     * In case the Show found by the `where` argument doesn't exist, create a new Show with this data.
     */
    create: XOR<ShowCreateInput, ShowUncheckedCreateInput>;
    /**
     * In case the Show was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShowUpdateInput, ShowUncheckedUpdateInput>;
  };

  /**
   * Show delete
   */
  export type ShowDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
    /**
     * Filter which Show to delete.
     */
    where: ShowWhereUniqueInput;
  };

  /**
   * Show deleteMany
   */
  export type ShowDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Shows to delete
     */
    where?: ShowWhereInput;
  };

  /**
   * Show without action
   */
  export type ShowDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Show
     */
    select?: ShowSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShowInclude<ExtArgs> | null;
  };

  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
  };

  export type CategoryMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    color: string | null;
    icon: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type CategoryMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    slug: string | null;
    description: string | null;
    color: string | null;
    icon: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  };

  export type CategoryCountAggregateOutputType = {
    id: number;
    name: number;
    slug: number;
    description: number;
    color: number;
    icon: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
    _all: number;
  };

  export type CategoryMinAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    color?: true;
    icon?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type CategoryMaxAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    color?: true;
    icon?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
  };

  export type CategoryCountAggregateInputType = {
    id?: true;
    name?: true;
    slug?: true;
    description?: true;
    color?: true;
    icon?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type CategoryAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Categories
     **/
    _count?: true | CategoryCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CategoryMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CategoryMaxAggregateInputType;
  };

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
    [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>;
  };

  export type CategoryGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CategoryWhereInput;
    orderBy?:
      | CategoryOrderByWithAggregationInput
      | CategoryOrderByWithAggregationInput[];
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum;
    having?: CategoryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CategoryCountAggregateInputType | true;
    _min?: CategoryMinAggregateInputType;
    _max?: CategoryMaxAggregateInputType;
  };

  export type CategoryGroupByOutputType = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: CategoryCountAggregateOutputType | null;
    _min: CategoryMinAggregateOutputType | null;
    _max: CategoryMaxAggregateOutputType | null;
  };

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CategoryGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CategoryGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>;
        }
      >
    >;

  export type CategorySelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      slug?: boolean;
      description?: boolean;
      color?: boolean;
      icon?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
      events?: boolean | Category$eventsArgs<ExtArgs>;
      _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['category']
  >;

  export type CategorySelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      slug?: boolean;
      description?: boolean;
      color?: boolean;
      icon?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      deletedAt?: boolean;
    },
    ExtArgs['result']['category']
  >;

  export type CategorySelectScalar = {
    id?: boolean;
    name?: boolean;
    slug?: boolean;
    description?: boolean;
    color?: boolean;
    icon?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    deletedAt?: boolean;
  };

  export type CategoryInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    events?: boolean | Category$eventsArgs<ExtArgs>;
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type CategoryIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $CategoryPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Category';
    objects: {
      events: Prisma.$EventPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
        icon: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['category']
    >;
    composites: {};
  };

  type CategoryGetPayload<
    S extends boolean | null | undefined | CategoryDefaultArgs,
  > = $Result.GetResult<Prisma.$CategoryPayload, S>;

  type CategoryCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: CategoryCountAggregateInputType | true;
  };

  export interface CategoryDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Category'];
      meta: { name: 'Category' };
    };
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(
      args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(
      args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     *
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CategoryFindManyArgs>(
      args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     *
     */
    create<T extends CategoryCreateArgs>(
      args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CategoryCreateManyArgs>(
      args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CategoryPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     *
     */
    delete<T extends CategoryDeleteArgs>(
      args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CategoryUpdateArgs>(
      args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CategoryDeleteManyArgs>(
      args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CategoryUpdateManyArgs>(
      args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(
      args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>
    ): Prisma__CategoryClient<
      $Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
     **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CategoryAggregateArgs>(
      args: Subset<T, CategoryAggregateArgs>
    ): Prisma.PrismaPromise<GetCategoryAggregateType<T>>;

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetCategoryGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Category model
     */
    readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    events<T extends Category$eventsArgs<ExtArgs> = {}>(
      args?: Subset<T, Category$eventsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findMany'> | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<'Category', 'String'>;
    readonly name: FieldRef<'Category', 'String'>;
    readonly slug: FieldRef<'Category', 'String'>;
    readonly description: FieldRef<'Category', 'String'>;
    readonly color: FieldRef<'Category', 'String'>;
    readonly icon: FieldRef<'Category', 'String'>;
    readonly isActive: FieldRef<'Category', 'Boolean'>;
    readonly createdAt: FieldRef<'Category', 'DateTime'>;
    readonly updatedAt: FieldRef<'Category', 'DateTime'>;
    readonly deletedAt: FieldRef<'Category', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Categories to fetch.
     */
    orderBy?:
      | CategoryOrderByWithRelationInput
      | CategoryOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Categories.
     */
    skip?: number;
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[];
  };

  /**
   * Category create
   */
  export type CategoryCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>;
  };

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Category update
   */
  export type CategoryUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>;
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Categories.
     */
    data: XOR<
      CategoryUpdateManyMutationInput,
      CategoryUncheckedUpdateManyInput
    >;
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput;
  };

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput;
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>;
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>;
  };

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput;
  };

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput;
  };

  /**
   * Category.events
   */
  export type Category$eventsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null;
    where?: EventWhereInput;
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[];
    cursor?: EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[];
  };

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null;
  };

  /**
   * Model EmailVerification
   */

  export type AggregateEmailVerification = {
    _count: EmailVerificationCountAggregateOutputType | null;
    _min: EmailVerificationMinAggregateOutputType | null;
    _max: EmailVerificationMaxAggregateOutputType | null;
  };

  export type EmailVerificationMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    token: string | null;
    type: $Enums.EmailVerificationType | null;
    expiresAt: Date | null;
    verifiedAt: Date | null;
    userId: string | null;
    createdAt: Date | null;
  };

  export type EmailVerificationMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    token: string | null;
    type: $Enums.EmailVerificationType | null;
    expiresAt: Date | null;
    verifiedAt: Date | null;
    userId: string | null;
    createdAt: Date | null;
  };

  export type EmailVerificationCountAggregateOutputType = {
    id: number;
    email: number;
    token: number;
    type: number;
    expiresAt: number;
    verifiedAt: number;
    userId: number;
    createdAt: number;
    _all: number;
  };

  export type EmailVerificationMinAggregateInputType = {
    id?: true;
    email?: true;
    token?: true;
    type?: true;
    expiresAt?: true;
    verifiedAt?: true;
    userId?: true;
    createdAt?: true;
  };

  export type EmailVerificationMaxAggregateInputType = {
    id?: true;
    email?: true;
    token?: true;
    type?: true;
    expiresAt?: true;
    verifiedAt?: true;
    userId?: true;
    createdAt?: true;
  };

  export type EmailVerificationCountAggregateInputType = {
    id?: true;
    email?: true;
    token?: true;
    type?: true;
    expiresAt?: true;
    verifiedAt?: true;
    userId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type EmailVerificationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EmailVerification to aggregate.
     */
    where?: EmailVerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?:
      | EmailVerificationOrderByWithRelationInput
      | EmailVerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: EmailVerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailVerifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned EmailVerifications
     **/
    _count?: true | EmailVerificationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: EmailVerificationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: EmailVerificationMaxAggregateInputType;
  };

  export type GetEmailVerificationAggregateType<
    T extends EmailVerificationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateEmailVerification]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailVerification[P]>
      : GetScalarType<T[P], AggregateEmailVerification[P]>;
  };

  export type EmailVerificationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: EmailVerificationWhereInput;
    orderBy?:
      | EmailVerificationOrderByWithAggregationInput
      | EmailVerificationOrderByWithAggregationInput[];
    by: EmailVerificationScalarFieldEnum[] | EmailVerificationScalarFieldEnum;
    having?: EmailVerificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmailVerificationCountAggregateInputType | true;
    _min?: EmailVerificationMinAggregateInputType;
    _max?: EmailVerificationMaxAggregateInputType;
  };

  export type EmailVerificationGroupByOutputType = {
    id: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date;
    verifiedAt: Date | null;
    userId: string | null;
    createdAt: Date;
    _count: EmailVerificationCountAggregateOutputType | null;
    _min: EmailVerificationMinAggregateOutputType | null;
    _max: EmailVerificationMaxAggregateOutputType | null;
  };

  type GetEmailVerificationGroupByPayload<
    T extends EmailVerificationGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailVerificationGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof EmailVerificationGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], EmailVerificationGroupByOutputType[P]>
          : GetScalarType<T[P], EmailVerificationGroupByOutputType[P]>;
      }
    >
  >;

  export type EmailVerificationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      token?: boolean;
      type?: boolean;
      expiresAt?: boolean;
      verifiedAt?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      user?: boolean | EmailVerification$userArgs<ExtArgs>;
    },
    ExtArgs['result']['emailVerification']
  >;

  export type EmailVerificationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      token?: boolean;
      type?: boolean;
      expiresAt?: boolean;
      verifiedAt?: boolean;
      userId?: boolean;
      createdAt?: boolean;
      user?: boolean | EmailVerification$userArgs<ExtArgs>;
    },
    ExtArgs['result']['emailVerification']
  >;

  export type EmailVerificationSelectScalar = {
    id?: boolean;
    email?: boolean;
    token?: boolean;
    type?: boolean;
    expiresAt?: boolean;
    verifiedAt?: boolean;
    userId?: boolean;
    createdAt?: boolean;
  };

  export type EmailVerificationInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | EmailVerification$userArgs<ExtArgs>;
  };
  export type EmailVerificationIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | EmailVerification$userArgs<ExtArgs>;
  };

  export type $EmailVerificationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'EmailVerification';
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        token: string;
        type: $Enums.EmailVerificationType;
        expiresAt: Date;
        verifiedAt: Date | null;
        userId: string | null;
        createdAt: Date;
      },
      ExtArgs['result']['emailVerification']
    >;
    composites: {};
  };

  type EmailVerificationGetPayload<
    S extends boolean | null | undefined | EmailVerificationDefaultArgs,
  > = $Result.GetResult<Prisma.$EmailVerificationPayload, S>;

  type EmailVerificationCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<EmailVerificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: EmailVerificationCountAggregateInputType | true;
  };

  export interface EmailVerificationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['EmailVerification'];
      meta: { name: 'EmailVerification' };
    };
    /**
     * Find zero or one EmailVerification that matches the filter.
     * @param {EmailVerificationFindUniqueArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailVerificationFindUniqueArgs>(
      args: SelectSubset<T, EmailVerificationFindUniqueArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<
        Prisma.$EmailVerificationPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one EmailVerification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailVerificationFindUniqueOrThrowArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailVerificationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, EmailVerificationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<
        Prisma.$EmailVerificationPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first EmailVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationFindFirstArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailVerificationFindFirstArgs>(
      args?: SelectSubset<T, EmailVerificationFindFirstArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<
        Prisma.$EmailVerificationPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first EmailVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationFindFirstOrThrowArgs} args - Arguments to find a EmailVerification
     * @example
     * // Get one EmailVerification
     * const emailVerification = await prisma.emailVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailVerificationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EmailVerificationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<
        Prisma.$EmailVerificationPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more EmailVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailVerifications
     * const emailVerifications = await prisma.emailVerification.findMany()
     *
     * // Get first 10 EmailVerifications
     * const emailVerifications = await prisma.emailVerification.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const emailVerificationWithIdOnly = await prisma.emailVerification.findMany({ select: { id: true } })
     *
     */
    findMany<T extends EmailVerificationFindManyArgs>(
      args?: SelectSubset<T, EmailVerificationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EmailVerificationPayload<ExtArgs>,
        T,
        'findMany'
      >
    >;

    /**
     * Create a EmailVerification.
     * @param {EmailVerificationCreateArgs} args - Arguments to create a EmailVerification.
     * @example
     * // Create one EmailVerification
     * const EmailVerification = await prisma.emailVerification.create({
     *   data: {
     *     // ... data to create a EmailVerification
     *   }
     * })
     *
     */
    create<T extends EmailVerificationCreateArgs>(
      args: SelectSubset<T, EmailVerificationCreateArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many EmailVerifications.
     * @param {EmailVerificationCreateManyArgs} args - Arguments to create many EmailVerifications.
     * @example
     * // Create many EmailVerifications
     * const emailVerification = await prisma.emailVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends EmailVerificationCreateManyArgs>(
      args?: SelectSubset<T, EmailVerificationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many EmailVerifications and returns the data saved in the database.
     * @param {EmailVerificationCreateManyAndReturnArgs} args - Arguments to create many EmailVerifications.
     * @example
     * // Create many EmailVerifications
     * const emailVerification = await prisma.emailVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many EmailVerifications and only return the `id`
     * const emailVerificationWithIdOnly = await prisma.emailVerification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends EmailVerificationCreateManyAndReturnArgs>(
      args?: SelectSubset<T, EmailVerificationCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$EmailVerificationPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a EmailVerification.
     * @param {EmailVerificationDeleteArgs} args - Arguments to delete one EmailVerification.
     * @example
     * // Delete one EmailVerification
     * const EmailVerification = await prisma.emailVerification.delete({
     *   where: {
     *     // ... filter to delete one EmailVerification
     *   }
     * })
     *
     */
    delete<T extends EmailVerificationDeleteArgs>(
      args: SelectSubset<T, EmailVerificationDeleteArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one EmailVerification.
     * @param {EmailVerificationUpdateArgs} args - Arguments to update one EmailVerification.
     * @example
     * // Update one EmailVerification
     * const emailVerification = await prisma.emailVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends EmailVerificationUpdateArgs>(
      args: SelectSubset<T, EmailVerificationUpdateArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more EmailVerifications.
     * @param {EmailVerificationDeleteManyArgs} args - Arguments to filter EmailVerifications to delete.
     * @example
     * // Delete a few EmailVerifications
     * const { count } = await prisma.emailVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends EmailVerificationDeleteManyArgs>(
      args?: SelectSubset<T, EmailVerificationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more EmailVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailVerifications
     * const emailVerification = await prisma.emailVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends EmailVerificationUpdateManyArgs>(
      args: SelectSubset<T, EmailVerificationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one EmailVerification.
     * @param {EmailVerificationUpsertArgs} args - Arguments to update or create a EmailVerification.
     * @example
     * // Update or create a EmailVerification
     * const emailVerification = await prisma.emailVerification.upsert({
     *   create: {
     *     // ... data to create a EmailVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailVerification we want to update
     *   }
     * })
     */
    upsert<T extends EmailVerificationUpsertArgs>(
      args: SelectSubset<T, EmailVerificationUpsertArgs<ExtArgs>>
    ): Prisma__EmailVerificationClient<
      $Result.GetResult<Prisma.$EmailVerificationPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of EmailVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationCountArgs} args - Arguments to filter EmailVerifications to count.
     * @example
     * // Count the number of EmailVerifications
     * const count = await prisma.emailVerification.count({
     *   where: {
     *     // ... the filter for the EmailVerifications we want to count
     *   }
     * })
     **/
    count<T extends EmailVerificationCountArgs>(
      args?: Subset<T, EmailVerificationCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<
              T['select'],
              EmailVerificationCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a EmailVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends EmailVerificationAggregateArgs>(
      args: Subset<T, EmailVerificationAggregateArgs>
    ): Prisma.PrismaPromise<GetEmailVerificationAggregateType<T>>;

    /**
     * Group by EmailVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends EmailVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailVerificationGroupByArgs['orderBy'] }
        : { orderBy?: EmailVerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, EmailVerificationGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetEmailVerificationGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the EmailVerification model
     */
    readonly fields: EmailVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailVerificationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends EmailVerification$userArgs<ExtArgs> = {}>(
      args?: Subset<T, EmailVerification$userArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the EmailVerification model
   */
  interface EmailVerificationFieldRefs {
    readonly id: FieldRef<'EmailVerification', 'String'>;
    readonly email: FieldRef<'EmailVerification', 'String'>;
    readonly token: FieldRef<'EmailVerification', 'String'>;
    readonly type: FieldRef<'EmailVerification', 'EmailVerificationType'>;
    readonly expiresAt: FieldRef<'EmailVerification', 'DateTime'>;
    readonly verifiedAt: FieldRef<'EmailVerification', 'DateTime'>;
    readonly userId: FieldRef<'EmailVerification', 'String'>;
    readonly createdAt: FieldRef<'EmailVerification', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * EmailVerification findUnique
   */
  export type EmailVerificationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * Filter, which EmailVerification to fetch.
     */
    where: EmailVerificationWhereUniqueInput;
  };

  /**
   * EmailVerification findUniqueOrThrow
   */
  export type EmailVerificationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * Filter, which EmailVerification to fetch.
     */
    where: EmailVerificationWhereUniqueInput;
  };

  /**
   * EmailVerification findFirst
   */
  export type EmailVerificationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * Filter, which EmailVerification to fetch.
     */
    where?: EmailVerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?:
      | EmailVerificationOrderByWithRelationInput
      | EmailVerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EmailVerifications.
     */
    cursor?: EmailVerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailVerifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EmailVerifications.
     */
    distinct?:
      | EmailVerificationScalarFieldEnum
      | EmailVerificationScalarFieldEnum[];
  };

  /**
   * EmailVerification findFirstOrThrow
   */
  export type EmailVerificationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * Filter, which EmailVerification to fetch.
     */
    where?: EmailVerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?:
      | EmailVerificationOrderByWithRelationInput
      | EmailVerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for EmailVerifications.
     */
    cursor?: EmailVerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailVerifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of EmailVerifications.
     */
    distinct?:
      | EmailVerificationScalarFieldEnum
      | EmailVerificationScalarFieldEnum[];
  };

  /**
   * EmailVerification findMany
   */
  export type EmailVerificationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * Filter, which EmailVerifications to fetch.
     */
    where?: EmailVerificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of EmailVerifications to fetch.
     */
    orderBy?:
      | EmailVerificationOrderByWithRelationInput
      | EmailVerificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing EmailVerifications.
     */
    cursor?: EmailVerificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` EmailVerifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` EmailVerifications.
     */
    skip?: number;
    distinct?:
      | EmailVerificationScalarFieldEnum
      | EmailVerificationScalarFieldEnum[];
  };

  /**
   * EmailVerification create
   */
  export type EmailVerificationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * The data needed to create a EmailVerification.
     */
    data: XOR<
      EmailVerificationCreateInput,
      EmailVerificationUncheckedCreateInput
    >;
  };

  /**
   * EmailVerification createMany
   */
  export type EmailVerificationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many EmailVerifications.
     */
    data: EmailVerificationCreateManyInput | EmailVerificationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * EmailVerification createManyAndReturn
   */
  export type EmailVerificationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many EmailVerifications.
     */
    data: EmailVerificationCreateManyInput | EmailVerificationCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * EmailVerification update
   */
  export type EmailVerificationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * The data needed to update a EmailVerification.
     */
    data: XOR<
      EmailVerificationUpdateInput,
      EmailVerificationUncheckedUpdateInput
    >;
    /**
     * Choose, which EmailVerification to update.
     */
    where: EmailVerificationWhereUniqueInput;
  };

  /**
   * EmailVerification updateMany
   */
  export type EmailVerificationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update EmailVerifications.
     */
    data: XOR<
      EmailVerificationUpdateManyMutationInput,
      EmailVerificationUncheckedUpdateManyInput
    >;
    /**
     * Filter which EmailVerifications to update
     */
    where?: EmailVerificationWhereInput;
  };

  /**
   * EmailVerification upsert
   */
  export type EmailVerificationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * The filter to search for the EmailVerification to update in case it exists.
     */
    where: EmailVerificationWhereUniqueInput;
    /**
     * In case the EmailVerification found by the `where` argument doesn't exist, create a new EmailVerification with this data.
     */
    create: XOR<
      EmailVerificationCreateInput,
      EmailVerificationUncheckedCreateInput
    >;
    /**
     * In case the EmailVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      EmailVerificationUpdateInput,
      EmailVerificationUncheckedUpdateInput
    >;
  };

  /**
   * EmailVerification delete
   */
  export type EmailVerificationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
    /**
     * Filter which EmailVerification to delete.
     */
    where: EmailVerificationWhereUniqueInput;
  };

  /**
   * EmailVerification deleteMany
   */
  export type EmailVerificationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which EmailVerifications to delete
     */
    where?: EmailVerificationWhereInput;
  };

  /**
   * EmailVerification.user
   */
  export type EmailVerification$userArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };

  /**
   * EmailVerification without action
   */
  export type EmailVerificationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the EmailVerification
     */
    select?: EmailVerificationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationInclude<ExtArgs> | null;
  };

  /**
   * Model Consent
   */

  export type AggregateConsent = {
    _count: ConsentCountAggregateOutputType | null;
    _min: ConsentMinAggregateOutputType | null;
    _max: ConsentMaxAggregateOutputType | null;
  };

  export type ConsentMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: $Enums.ConsentType | null;
    granted: boolean | null;
    grantedAt: Date | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ConsentMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    type: $Enums.ConsentType | null;
    granted: boolean | null;
    grantedAt: Date | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type ConsentCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    granted: number;
    grantedAt: number;
    ipAddress: number;
    userAgent: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type ConsentMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    granted?: true;
    grantedAt?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ConsentMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    granted?: true;
    grantedAt?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type ConsentCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    granted?: true;
    grantedAt?: true;
    ipAddress?: true;
    userAgent?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type ConsentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Consent to aggregate.
     */
    where?: ConsentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Consents to fetch.
     */
    orderBy?:
      | ConsentOrderByWithRelationInput
      | ConsentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ConsentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Consents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Consents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Consents
     **/
    _count?: true | ConsentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ConsentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ConsentMaxAggregateInputType;
  };

  export type GetConsentAggregateType<T extends ConsentAggregateArgs> = {
    [P in keyof T & keyof AggregateConsent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsent[P]>
      : GetScalarType<T[P], AggregateConsent[P]>;
  };

  export type ConsentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ConsentWhereInput;
    orderBy?:
      | ConsentOrderByWithAggregationInput
      | ConsentOrderByWithAggregationInput[];
    by: ConsentScalarFieldEnum[] | ConsentScalarFieldEnum;
    having?: ConsentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ConsentCountAggregateInputType | true;
    _min?: ConsentMinAggregateInputType;
    _max?: ConsentMaxAggregateInputType;
  };

  export type ConsentGroupByOutputType = {
    id: string;
    userId: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt: Date | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ConsentCountAggregateOutputType | null;
    _min: ConsentMinAggregateOutputType | null;
    _max: ConsentMaxAggregateOutputType | null;
  };

  type GetConsentGroupByPayload<T extends ConsentGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ConsentGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ConsentGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentGroupByOutputType[P]>;
        }
      >
    >;

  export type ConsentSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      type?: boolean;
      granted?: boolean;
      grantedAt?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['consent']
  >;

  export type ConsentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      type?: boolean;
      granted?: boolean;
      grantedAt?: boolean;
      ipAddress?: boolean;
      userAgent?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['consent']
  >;

  export type ConsentSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    granted?: boolean;
    grantedAt?: boolean;
    ipAddress?: boolean;
    userAgent?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type ConsentInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type ConsentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $ConsentPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Consent';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        type: $Enums.ConsentType;
        granted: boolean;
        grantedAt: Date | null;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['consent']
    >;
    composites: {};
  };

  type ConsentGetPayload<
    S extends boolean | null | undefined | ConsentDefaultArgs,
  > = $Result.GetResult<Prisma.$ConsentPayload, S>;

  type ConsentCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ConsentFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: ConsentCountAggregateInputType | true;
  };

  export interface ConsentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Consent'];
      meta: { name: 'Consent' };
    };
    /**
     * Find zero or one Consent that matches the filter.
     * @param {ConsentFindUniqueArgs} args - Arguments to find a Consent
     * @example
     * // Get one Consent
     * const consent = await prisma.consent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentFindUniqueArgs>(
      args: SelectSubset<T, ConsentFindUniqueArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<
        Prisma.$ConsentPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Consent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConsentFindUniqueOrThrowArgs} args - Arguments to find a Consent
     * @example
     * // Get one Consent
     * const consent = await prisma.consent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ConsentFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<
        Prisma.$ConsentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Consent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentFindFirstArgs} args - Arguments to find a Consent
     * @example
     * // Get one Consent
     * const consent = await prisma.consent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentFindFirstArgs>(
      args?: SelectSubset<T, ConsentFindFirstArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'findFirst'> | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Consent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentFindFirstOrThrowArgs} args - Arguments to find a Consent
     * @example
     * // Get one Consent
     * const consent = await prisma.consent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ConsentFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'findFirstOrThrow'>,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Consents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Consents
     * const consents = await prisma.consent.findMany()
     *
     * // Get first 10 Consents
     * const consents = await prisma.consent.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const consentWithIdOnly = await prisma.consent.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ConsentFindManyArgs>(
      args?: SelectSubset<T, ConsentFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Consent.
     * @param {ConsentCreateArgs} args - Arguments to create a Consent.
     * @example
     * // Create one Consent
     * const Consent = await prisma.consent.create({
     *   data: {
     *     // ... data to create a Consent
     *   }
     * })
     *
     */
    create<T extends ConsentCreateArgs>(
      args: SelectSubset<T, ConsentCreateArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Consents.
     * @param {ConsentCreateManyArgs} args - Arguments to create many Consents.
     * @example
     * // Create many Consents
     * const consent = await prisma.consent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ConsentCreateManyArgs>(
      args?: SelectSubset<T, ConsentCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Consents and returns the data saved in the database.
     * @param {ConsentCreateManyAndReturnArgs} args - Arguments to create many Consents.
     * @example
     * // Create many Consents
     * const consent = await prisma.consent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Consents and only return the `id`
     * const consentWithIdOnly = await prisma.consent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ConsentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ConsentCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ConsentPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Consent.
     * @param {ConsentDeleteArgs} args - Arguments to delete one Consent.
     * @example
     * // Delete one Consent
     * const Consent = await prisma.consent.delete({
     *   where: {
     *     // ... filter to delete one Consent
     *   }
     * })
     *
     */
    delete<T extends ConsentDeleteArgs>(
      args: SelectSubset<T, ConsentDeleteArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Consent.
     * @param {ConsentUpdateArgs} args - Arguments to update one Consent.
     * @example
     * // Update one Consent
     * const consent = await prisma.consent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ConsentUpdateArgs>(
      args: SelectSubset<T, ConsentUpdateArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Consents.
     * @param {ConsentDeleteManyArgs} args - Arguments to filter Consents to delete.
     * @example
     * // Delete a few Consents
     * const { count } = await prisma.consent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ConsentDeleteManyArgs>(
      args?: SelectSubset<T, ConsentDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Consents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Consents
     * const consent = await prisma.consent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ConsentUpdateManyArgs>(
      args: SelectSubset<T, ConsentUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Consent.
     * @param {ConsentUpsertArgs} args - Arguments to update or create a Consent.
     * @example
     * // Update or create a Consent
     * const consent = await prisma.consent.upsert({
     *   create: {
     *     // ... data to create a Consent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Consent we want to update
     *   }
     * })
     */
    upsert<T extends ConsentUpsertArgs>(
      args: SelectSubset<T, ConsentUpsertArgs<ExtArgs>>
    ): Prisma__ConsentClient<
      $Result.GetResult<Prisma.$ConsentPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Consents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentCountArgs} args - Arguments to filter Consents to count.
     * @example
     * // Count the number of Consents
     * const count = await prisma.consent.count({
     *   where: {
     *     // ... the filter for the Consents we want to count
     *   }
     * })
     **/
    count<T extends ConsentCountArgs>(
      args?: Subset<T, ConsentCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Consent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ConsentAggregateArgs>(
      args: Subset<T, ConsentAggregateArgs>
    ): Prisma.PrismaPromise<GetConsentAggregateType<T>>;

    /**
     * Group by Consent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ConsentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentGroupByArgs['orderBy'] }
        : { orderBy?: ConsentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ConsentGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetConsentGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Consent model
     */
    readonly fields: ConsentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Consent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Consent model
   */
  interface ConsentFieldRefs {
    readonly id: FieldRef<'Consent', 'String'>;
    readonly userId: FieldRef<'Consent', 'String'>;
    readonly type: FieldRef<'Consent', 'ConsentType'>;
    readonly granted: FieldRef<'Consent', 'Boolean'>;
    readonly grantedAt: FieldRef<'Consent', 'DateTime'>;
    readonly ipAddress: FieldRef<'Consent', 'String'>;
    readonly userAgent: FieldRef<'Consent', 'String'>;
    readonly createdAt: FieldRef<'Consent', 'DateTime'>;
    readonly updatedAt: FieldRef<'Consent', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Consent findUnique
   */
  export type ConsentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * Filter, which Consent to fetch.
     */
    where: ConsentWhereUniqueInput;
  };

  /**
   * Consent findUniqueOrThrow
   */
  export type ConsentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * Filter, which Consent to fetch.
     */
    where: ConsentWhereUniqueInput;
  };

  /**
   * Consent findFirst
   */
  export type ConsentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * Filter, which Consent to fetch.
     */
    where?: ConsentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Consents to fetch.
     */
    orderBy?:
      | ConsentOrderByWithRelationInput
      | ConsentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Consents.
     */
    cursor?: ConsentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Consents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Consents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Consents.
     */
    distinct?: ConsentScalarFieldEnum | ConsentScalarFieldEnum[];
  };

  /**
   * Consent findFirstOrThrow
   */
  export type ConsentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * Filter, which Consent to fetch.
     */
    where?: ConsentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Consents to fetch.
     */
    orderBy?:
      | ConsentOrderByWithRelationInput
      | ConsentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Consents.
     */
    cursor?: ConsentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Consents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Consents.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Consents.
     */
    distinct?: ConsentScalarFieldEnum | ConsentScalarFieldEnum[];
  };

  /**
   * Consent findMany
   */
  export type ConsentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * Filter, which Consents to fetch.
     */
    where?: ConsentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Consents to fetch.
     */
    orderBy?:
      | ConsentOrderByWithRelationInput
      | ConsentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Consents.
     */
    cursor?: ConsentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Consents from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Consents.
     */
    skip?: number;
    distinct?: ConsentScalarFieldEnum | ConsentScalarFieldEnum[];
  };

  /**
   * Consent create
   */
  export type ConsentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Consent.
     */
    data: XOR<ConsentCreateInput, ConsentUncheckedCreateInput>;
  };

  /**
   * Consent createMany
   */
  export type ConsentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Consents.
     */
    data: ConsentCreateManyInput | ConsentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Consent createManyAndReturn
   */
  export type ConsentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Consents.
     */
    data: ConsentCreateManyInput | ConsentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Consent update
   */
  export type ConsentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Consent.
     */
    data: XOR<ConsentUpdateInput, ConsentUncheckedUpdateInput>;
    /**
     * Choose, which Consent to update.
     */
    where: ConsentWhereUniqueInput;
  };

  /**
   * Consent updateMany
   */
  export type ConsentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Consents.
     */
    data: XOR<ConsentUpdateManyMutationInput, ConsentUncheckedUpdateManyInput>;
    /**
     * Filter which Consents to update
     */
    where?: ConsentWhereInput;
  };

  /**
   * Consent upsert
   */
  export type ConsentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Consent to update in case it exists.
     */
    where: ConsentWhereUniqueInput;
    /**
     * In case the Consent found by the `where` argument doesn't exist, create a new Consent with this data.
     */
    create: XOR<ConsentCreateInput, ConsentUncheckedCreateInput>;
    /**
     * In case the Consent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentUpdateInput, ConsentUncheckedUpdateInput>;
  };

  /**
   * Consent delete
   */
  export type ConsentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
    /**
     * Filter which Consent to delete.
     */
    where: ConsentWhereUniqueInput;
  };

  /**
   * Consent deleteMany
   */
  export type ConsentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Consents to delete
     */
    where?: ConsentWhereInput;
  };

  /**
   * Consent without action
   */
  export type ConsentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Consent
     */
    select?: ConsentSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConsentInclude<ExtArgs> | null;
  };

  /**
   * Model NearbyPlace
   */

  export type AggregateNearbyPlace = {
    _count: NearbyPlaceCountAggregateOutputType | null;
    _avg: NearbyPlaceAvgAggregateOutputType | null;
    _sum: NearbyPlaceSumAggregateOutputType | null;
    _min: NearbyPlaceMinAggregateOutputType | null;
    _max: NearbyPlaceMaxAggregateOutputType | null;
  };

  export type NearbyPlaceAvgAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
    rating: number | null;
    distance: number | null;
  };

  export type NearbyPlaceSumAggregateOutputType = {
    latitude: number | null;
    longitude: number | null;
    rating: number | null;
    distance: number | null;
  };

  export type NearbyPlaceMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    category: string | null;
    rating: number | null;
    website: string | null;
    phone: string | null;
    distance: number | null;
    eventId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type NearbyPlaceMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    category: string | null;
    rating: number | null;
    website: string | null;
    phone: string | null;
    distance: number | null;
    eventId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type NearbyPlaceCountAggregateOutputType = {
    id: number;
    name: number;
    address: number;
    latitude: number;
    longitude: number;
    category: number;
    rating: number;
    website: number;
    phone: number;
    distance: number;
    eventId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type NearbyPlaceAvgAggregateInputType = {
    latitude?: true;
    longitude?: true;
    rating?: true;
    distance?: true;
  };

  export type NearbyPlaceSumAggregateInputType = {
    latitude?: true;
    longitude?: true;
    rating?: true;
    distance?: true;
  };

  export type NearbyPlaceMinAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    latitude?: true;
    longitude?: true;
    category?: true;
    rating?: true;
    website?: true;
    phone?: true;
    distance?: true;
    eventId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type NearbyPlaceMaxAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    latitude?: true;
    longitude?: true;
    category?: true;
    rating?: true;
    website?: true;
    phone?: true;
    distance?: true;
    eventId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type NearbyPlaceCountAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    latitude?: true;
    longitude?: true;
    category?: true;
    rating?: true;
    website?: true;
    phone?: true;
    distance?: true;
    eventId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type NearbyPlaceAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which NearbyPlace to aggregate.
     */
    where?: NearbyPlaceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NearbyPlaces to fetch.
     */
    orderBy?:
      | NearbyPlaceOrderByWithRelationInput
      | NearbyPlaceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: NearbyPlaceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NearbyPlaces from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NearbyPlaces.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned NearbyPlaces
     **/
    _count?: true | NearbyPlaceCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: NearbyPlaceAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: NearbyPlaceSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: NearbyPlaceMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: NearbyPlaceMaxAggregateInputType;
  };

  export type GetNearbyPlaceAggregateType<T extends NearbyPlaceAggregateArgs> =
    {
      [P in keyof T & keyof AggregateNearbyPlace]: P extends '_count' | 'count'
        ? T[P] extends true
          ? number
          : GetScalarType<T[P], AggregateNearbyPlace[P]>
        : GetScalarType<T[P], AggregateNearbyPlace[P]>;
    };

  export type NearbyPlaceGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NearbyPlaceWhereInput;
    orderBy?:
      | NearbyPlaceOrderByWithAggregationInput
      | NearbyPlaceOrderByWithAggregationInput[];
    by: NearbyPlaceScalarFieldEnum[] | NearbyPlaceScalarFieldEnum;
    having?: NearbyPlaceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NearbyPlaceCountAggregateInputType | true;
    _avg?: NearbyPlaceAvgAggregateInputType;
    _sum?: NearbyPlaceSumAggregateInputType;
    _min?: NearbyPlaceMinAggregateInputType;
    _max?: NearbyPlaceMaxAggregateInputType;
  };

  export type NearbyPlaceGroupByOutputType = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating: number | null;
    website: string | null;
    phone: string | null;
    distance: number | null;
    eventId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: NearbyPlaceCountAggregateOutputType | null;
    _avg: NearbyPlaceAvgAggregateOutputType | null;
    _sum: NearbyPlaceSumAggregateOutputType | null;
    _min: NearbyPlaceMinAggregateOutputType | null;
    _max: NearbyPlaceMaxAggregateOutputType | null;
  };

  type GetNearbyPlaceGroupByPayload<T extends NearbyPlaceGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<NearbyPlaceGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof NearbyPlaceGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NearbyPlaceGroupByOutputType[P]>
            : GetScalarType<T[P], NearbyPlaceGroupByOutputType[P]>;
        }
      >
    >;

  export type NearbyPlaceSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      latitude?: boolean;
      longitude?: boolean;
      category?: boolean;
      rating?: boolean;
      website?: boolean;
      phone?: boolean;
      distance?: boolean;
      eventId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['nearbyPlace']
  >;

  export type NearbyPlaceSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      latitude?: boolean;
      longitude?: boolean;
      category?: boolean;
      rating?: boolean;
      website?: boolean;
      phone?: boolean;
      distance?: boolean;
      eventId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      event?: boolean | EventDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['nearbyPlace']
  >;

  export type NearbyPlaceSelectScalar = {
    id?: boolean;
    name?: boolean;
    address?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    category?: boolean;
    rating?: boolean;
    website?: boolean;
    phone?: boolean;
    distance?: boolean;
    eventId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type NearbyPlaceInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };
  export type NearbyPlaceIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    event?: boolean | EventDefaultArgs<ExtArgs>;
  };

  export type $NearbyPlacePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'NearbyPlace';
    objects: {
      event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        category: string;
        rating: number | null;
        website: string | null;
        phone: string | null;
        distance: number | null;
        eventId: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['nearbyPlace']
    >;
    composites: {};
  };

  type NearbyPlaceGetPayload<
    S extends boolean | null | undefined | NearbyPlaceDefaultArgs,
  > = $Result.GetResult<Prisma.$NearbyPlacePayload, S>;

  type NearbyPlaceCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<NearbyPlaceFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: NearbyPlaceCountAggregateInputType | true;
  };

  export interface NearbyPlaceDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['NearbyPlace'];
      meta: { name: 'NearbyPlace' };
    };
    /**
     * Find zero or one NearbyPlace that matches the filter.
     * @param {NearbyPlaceFindUniqueArgs} args - Arguments to find a NearbyPlace
     * @example
     * // Get one NearbyPlace
     * const nearbyPlace = await prisma.nearbyPlace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NearbyPlaceFindUniqueArgs>(
      args: SelectSubset<T, NearbyPlaceFindUniqueArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<
        Prisma.$NearbyPlacePayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one NearbyPlace that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NearbyPlaceFindUniqueOrThrowArgs} args - Arguments to find a NearbyPlace
     * @example
     * // Get one NearbyPlace
     * const nearbyPlace = await prisma.nearbyPlace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NearbyPlaceFindUniqueOrThrowArgs>(
      args: SelectSubset<T, NearbyPlaceFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<
        Prisma.$NearbyPlacePayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first NearbyPlace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceFindFirstArgs} args - Arguments to find a NearbyPlace
     * @example
     * // Get one NearbyPlace
     * const nearbyPlace = await prisma.nearbyPlace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NearbyPlaceFindFirstArgs>(
      args?: SelectSubset<T, NearbyPlaceFindFirstArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<
        Prisma.$NearbyPlacePayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first NearbyPlace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceFindFirstOrThrowArgs} args - Arguments to find a NearbyPlace
     * @example
     * // Get one NearbyPlace
     * const nearbyPlace = await prisma.nearbyPlace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NearbyPlaceFindFirstOrThrowArgs>(
      args?: SelectSubset<T, NearbyPlaceFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<
        Prisma.$NearbyPlacePayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more NearbyPlaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NearbyPlaces
     * const nearbyPlaces = await prisma.nearbyPlace.findMany()
     *
     * // Get first 10 NearbyPlaces
     * const nearbyPlaces = await prisma.nearbyPlace.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const nearbyPlaceWithIdOnly = await prisma.nearbyPlace.findMany({ select: { id: true } })
     *
     */
    findMany<T extends NearbyPlaceFindManyArgs>(
      args?: SelectSubset<T, NearbyPlaceFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$NearbyPlacePayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a NearbyPlace.
     * @param {NearbyPlaceCreateArgs} args - Arguments to create a NearbyPlace.
     * @example
     * // Create one NearbyPlace
     * const NearbyPlace = await prisma.nearbyPlace.create({
     *   data: {
     *     // ... data to create a NearbyPlace
     *   }
     * })
     *
     */
    create<T extends NearbyPlaceCreateArgs>(
      args: SelectSubset<T, NearbyPlaceCreateArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<Prisma.$NearbyPlacePayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many NearbyPlaces.
     * @param {NearbyPlaceCreateManyArgs} args - Arguments to create many NearbyPlaces.
     * @example
     * // Create many NearbyPlaces
     * const nearbyPlace = await prisma.nearbyPlace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends NearbyPlaceCreateManyArgs>(
      args?: SelectSubset<T, NearbyPlaceCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many NearbyPlaces and returns the data saved in the database.
     * @param {NearbyPlaceCreateManyAndReturnArgs} args - Arguments to create many NearbyPlaces.
     * @example
     * // Create many NearbyPlaces
     * const nearbyPlace = await prisma.nearbyPlace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many NearbyPlaces and only return the `id`
     * const nearbyPlaceWithIdOnly = await prisma.nearbyPlace.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends NearbyPlaceCreateManyAndReturnArgs>(
      args?: SelectSubset<T, NearbyPlaceCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NearbyPlacePayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a NearbyPlace.
     * @param {NearbyPlaceDeleteArgs} args - Arguments to delete one NearbyPlace.
     * @example
     * // Delete one NearbyPlace
     * const NearbyPlace = await prisma.nearbyPlace.delete({
     *   where: {
     *     // ... filter to delete one NearbyPlace
     *   }
     * })
     *
     */
    delete<T extends NearbyPlaceDeleteArgs>(
      args: SelectSubset<T, NearbyPlaceDeleteArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<Prisma.$NearbyPlacePayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one NearbyPlace.
     * @param {NearbyPlaceUpdateArgs} args - Arguments to update one NearbyPlace.
     * @example
     * // Update one NearbyPlace
     * const nearbyPlace = await prisma.nearbyPlace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends NearbyPlaceUpdateArgs>(
      args: SelectSubset<T, NearbyPlaceUpdateArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<Prisma.$NearbyPlacePayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more NearbyPlaces.
     * @param {NearbyPlaceDeleteManyArgs} args - Arguments to filter NearbyPlaces to delete.
     * @example
     * // Delete a few NearbyPlaces
     * const { count } = await prisma.nearbyPlace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends NearbyPlaceDeleteManyArgs>(
      args?: SelectSubset<T, NearbyPlaceDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more NearbyPlaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NearbyPlaces
     * const nearbyPlace = await prisma.nearbyPlace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends NearbyPlaceUpdateManyArgs>(
      args: SelectSubset<T, NearbyPlaceUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one NearbyPlace.
     * @param {NearbyPlaceUpsertArgs} args - Arguments to update or create a NearbyPlace.
     * @example
     * // Update or create a NearbyPlace
     * const nearbyPlace = await prisma.nearbyPlace.upsert({
     *   create: {
     *     // ... data to create a NearbyPlace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NearbyPlace we want to update
     *   }
     * })
     */
    upsert<T extends NearbyPlaceUpsertArgs>(
      args: SelectSubset<T, NearbyPlaceUpsertArgs<ExtArgs>>
    ): Prisma__NearbyPlaceClient<
      $Result.GetResult<Prisma.$NearbyPlacePayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of NearbyPlaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceCountArgs} args - Arguments to filter NearbyPlaces to count.
     * @example
     * // Count the number of NearbyPlaces
     * const count = await prisma.nearbyPlace.count({
     *   where: {
     *     // ... the filter for the NearbyPlaces we want to count
     *   }
     * })
     **/
    count<T extends NearbyPlaceCountArgs>(
      args?: Subset<T, NearbyPlaceCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NearbyPlaceCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a NearbyPlace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends NearbyPlaceAggregateArgs>(
      args: Subset<T, NearbyPlaceAggregateArgs>
    ): Prisma.PrismaPromise<GetNearbyPlaceAggregateType<T>>;

    /**
     * Group by NearbyPlace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NearbyPlaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends NearbyPlaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NearbyPlaceGroupByArgs['orderBy'] }
        : { orderBy?: NearbyPlaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, NearbyPlaceGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetNearbyPlaceGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the NearbyPlace model
     */
    readonly fields: NearbyPlaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NearbyPlace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NearbyPlaceClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    event<T extends EventDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, EventDefaultArgs<ExtArgs>>
    ): Prisma__EventClient<
      | $Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the NearbyPlace model
   */
  interface NearbyPlaceFieldRefs {
    readonly id: FieldRef<'NearbyPlace', 'String'>;
    readonly name: FieldRef<'NearbyPlace', 'String'>;
    readonly address: FieldRef<'NearbyPlace', 'String'>;
    readonly latitude: FieldRef<'NearbyPlace', 'Float'>;
    readonly longitude: FieldRef<'NearbyPlace', 'Float'>;
    readonly category: FieldRef<'NearbyPlace', 'String'>;
    readonly rating: FieldRef<'NearbyPlace', 'Float'>;
    readonly website: FieldRef<'NearbyPlace', 'String'>;
    readonly phone: FieldRef<'NearbyPlace', 'String'>;
    readonly distance: FieldRef<'NearbyPlace', 'Float'>;
    readonly eventId: FieldRef<'NearbyPlace', 'String'>;
    readonly createdAt: FieldRef<'NearbyPlace', 'DateTime'>;
    readonly updatedAt: FieldRef<'NearbyPlace', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * NearbyPlace findUnique
   */
  export type NearbyPlaceFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * Filter, which NearbyPlace to fetch.
     */
    where: NearbyPlaceWhereUniqueInput;
  };

  /**
   * NearbyPlace findUniqueOrThrow
   */
  export type NearbyPlaceFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * Filter, which NearbyPlace to fetch.
     */
    where: NearbyPlaceWhereUniqueInput;
  };

  /**
   * NearbyPlace findFirst
   */
  export type NearbyPlaceFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * Filter, which NearbyPlace to fetch.
     */
    where?: NearbyPlaceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NearbyPlaces to fetch.
     */
    orderBy?:
      | NearbyPlaceOrderByWithRelationInput
      | NearbyPlaceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for NearbyPlaces.
     */
    cursor?: NearbyPlaceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NearbyPlaces from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NearbyPlaces.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of NearbyPlaces.
     */
    distinct?: NearbyPlaceScalarFieldEnum | NearbyPlaceScalarFieldEnum[];
  };

  /**
   * NearbyPlace findFirstOrThrow
   */
  export type NearbyPlaceFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * Filter, which NearbyPlace to fetch.
     */
    where?: NearbyPlaceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NearbyPlaces to fetch.
     */
    orderBy?:
      | NearbyPlaceOrderByWithRelationInput
      | NearbyPlaceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for NearbyPlaces.
     */
    cursor?: NearbyPlaceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NearbyPlaces from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NearbyPlaces.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of NearbyPlaces.
     */
    distinct?: NearbyPlaceScalarFieldEnum | NearbyPlaceScalarFieldEnum[];
  };

  /**
   * NearbyPlace findMany
   */
  export type NearbyPlaceFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * Filter, which NearbyPlaces to fetch.
     */
    where?: NearbyPlaceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of NearbyPlaces to fetch.
     */
    orderBy?:
      | NearbyPlaceOrderByWithRelationInput
      | NearbyPlaceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing NearbyPlaces.
     */
    cursor?: NearbyPlaceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` NearbyPlaces from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` NearbyPlaces.
     */
    skip?: number;
    distinct?: NearbyPlaceScalarFieldEnum | NearbyPlaceScalarFieldEnum[];
  };

  /**
   * NearbyPlace create
   */
  export type NearbyPlaceCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * The data needed to create a NearbyPlace.
     */
    data: XOR<NearbyPlaceCreateInput, NearbyPlaceUncheckedCreateInput>;
  };

  /**
   * NearbyPlace createMany
   */
  export type NearbyPlaceCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many NearbyPlaces.
     */
    data: NearbyPlaceCreateManyInput | NearbyPlaceCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * NearbyPlace createManyAndReturn
   */
  export type NearbyPlaceCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many NearbyPlaces.
     */
    data: NearbyPlaceCreateManyInput | NearbyPlaceCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * NearbyPlace update
   */
  export type NearbyPlaceUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * The data needed to update a NearbyPlace.
     */
    data: XOR<NearbyPlaceUpdateInput, NearbyPlaceUncheckedUpdateInput>;
    /**
     * Choose, which NearbyPlace to update.
     */
    where: NearbyPlaceWhereUniqueInput;
  };

  /**
   * NearbyPlace updateMany
   */
  export type NearbyPlaceUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update NearbyPlaces.
     */
    data: XOR<
      NearbyPlaceUpdateManyMutationInput,
      NearbyPlaceUncheckedUpdateManyInput
    >;
    /**
     * Filter which NearbyPlaces to update
     */
    where?: NearbyPlaceWhereInput;
  };

  /**
   * NearbyPlace upsert
   */
  export type NearbyPlaceUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * The filter to search for the NearbyPlace to update in case it exists.
     */
    where: NearbyPlaceWhereUniqueInput;
    /**
     * In case the NearbyPlace found by the `where` argument doesn't exist, create a new NearbyPlace with this data.
     */
    create: XOR<NearbyPlaceCreateInput, NearbyPlaceUncheckedCreateInput>;
    /**
     * In case the NearbyPlace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NearbyPlaceUpdateInput, NearbyPlaceUncheckedUpdateInput>;
  };

  /**
   * NearbyPlace delete
   */
  export type NearbyPlaceDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
    /**
     * Filter which NearbyPlace to delete.
     */
    where: NearbyPlaceWhereUniqueInput;
  };

  /**
   * NearbyPlace deleteMany
   */
  export type NearbyPlaceDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which NearbyPlaces to delete
     */
    where?: NearbyPlaceWhereInput;
  };

  /**
   * NearbyPlace without action
   */
  export type NearbyPlaceDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the NearbyPlace
     */
    select?: NearbyPlaceSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NearbyPlaceInclude<ExtArgs> | null;
  };

  /**
   * Model Invitation
   */

  export type AggregateInvitation = {
    _count: InvitationCountAggregateOutputType | null;
    _min: InvitationMinAggregateOutputType | null;
    _max: InvitationMaxAggregateOutputType | null;
  };

  export type InvitationMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    role: $Enums.UserRole | null;
    token: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    invitedBy: string | null;
    createdAt: Date | null;
  };

  export type InvitationMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    role: $Enums.UserRole | null;
    token: string | null;
    expiresAt: Date | null;
    acceptedAt: Date | null;
    invitedBy: string | null;
    createdAt: Date | null;
  };

  export type InvitationCountAggregateOutputType = {
    id: number;
    email: number;
    role: number;
    token: number;
    expiresAt: number;
    acceptedAt: number;
    invitedBy: number;
    createdAt: number;
    _all: number;
  };

  export type InvitationMinAggregateInputType = {
    id?: true;
    email?: true;
    role?: true;
    token?: true;
    expiresAt?: true;
    acceptedAt?: true;
    invitedBy?: true;
    createdAt?: true;
  };

  export type InvitationMaxAggregateInputType = {
    id?: true;
    email?: true;
    role?: true;
    token?: true;
    expiresAt?: true;
    acceptedAt?: true;
    invitedBy?: true;
    createdAt?: true;
  };

  export type InvitationCountAggregateInputType = {
    id?: true;
    email?: true;
    role?: true;
    token?: true;
    expiresAt?: true;
    acceptedAt?: true;
    invitedBy?: true;
    createdAt?: true;
    _all?: true;
  };

  export type InvitationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Invitation to aggregate.
     */
    where?: InvitationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Invitations to fetch.
     */
    orderBy?:
      | InvitationOrderByWithRelationInput
      | InvitationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: InvitationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Invitations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Invitations
     **/
    _count?: true | InvitationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: InvitationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: InvitationMaxAggregateInputType;
  };

  export type GetInvitationAggregateType<T extends InvitationAggregateArgs> = {
    [P in keyof T & keyof AggregateInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvitation[P]>
      : GetScalarType<T[P], AggregateInvitation[P]>;
  };

  export type InvitationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: InvitationWhereInput;
    orderBy?:
      | InvitationOrderByWithAggregationInput
      | InvitationOrderByWithAggregationInput[];
    by: InvitationScalarFieldEnum[] | InvitationScalarFieldEnum;
    having?: InvitationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InvitationCountAggregateInputType | true;
    _min?: InvitationMinAggregateInputType;
    _max?: InvitationMaxAggregateInputType;
  };

  export type InvitationGroupByOutputType = {
    id: string;
    email: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    invitedBy: string;
    createdAt: Date;
    _count: InvitationCountAggregateOutputType | null;
    _min: InvitationMinAggregateOutputType | null;
    _max: InvitationMaxAggregateOutputType | null;
  };

  type GetInvitationGroupByPayload<T extends InvitationGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<InvitationGroupByOutputType, T['by']> & {
          [P in keyof T & keyof InvitationGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvitationGroupByOutputType[P]>
            : GetScalarType<T[P], InvitationGroupByOutputType[P]>;
        }
      >
    >;

  export type InvitationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      role?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      acceptedAt?: boolean;
      invitedBy?: boolean;
      createdAt?: boolean;
      inviter?: boolean | UserDefaultArgs<ExtArgs>;
      invitee?: boolean | Invitation$inviteeArgs<ExtArgs>;
    },
    ExtArgs['result']['invitation']
  >;

  export type InvitationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      role?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      acceptedAt?: boolean;
      invitedBy?: boolean;
      createdAt?: boolean;
      inviter?: boolean | UserDefaultArgs<ExtArgs>;
      invitee?: boolean | Invitation$inviteeArgs<ExtArgs>;
    },
    ExtArgs['result']['invitation']
  >;

  export type InvitationSelectScalar = {
    id?: boolean;
    email?: boolean;
    role?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    acceptedAt?: boolean;
    invitedBy?: boolean;
    createdAt?: boolean;
  };

  export type InvitationInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    inviter?: boolean | UserDefaultArgs<ExtArgs>;
    invitee?: boolean | Invitation$inviteeArgs<ExtArgs>;
  };
  export type InvitationIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    inviter?: boolean | UserDefaultArgs<ExtArgs>;
    invitee?: boolean | Invitation$inviteeArgs<ExtArgs>;
  };

  export type $InvitationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Invitation';
    objects: {
      inviter: Prisma.$UserPayload<ExtArgs>;
      invitee: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        role: $Enums.UserRole;
        token: string;
        expiresAt: Date;
        acceptedAt: Date | null;
        invitedBy: string;
        createdAt: Date;
      },
      ExtArgs['result']['invitation']
    >;
    composites: {};
  };

  type InvitationGetPayload<
    S extends boolean | null | undefined | InvitationDefaultArgs,
  > = $Result.GetResult<Prisma.$InvitationPayload, S>;

  type InvitationCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<InvitationFindManyArgs, 'select' | 'include' | 'distinct'> & {
    select?: InvitationCountAggregateInputType | true;
  };

  export interface InvitationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Invitation'];
      meta: { name: 'Invitation' };
    };
    /**
     * Find zero or one Invitation that matches the filter.
     * @param {InvitationFindUniqueArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvitationFindUniqueArgs>(
      args: SelectSubset<T, InvitationFindUniqueArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<
        Prisma.$InvitationPayload<ExtArgs>,
        T,
        'findUnique'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find one Invitation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvitationFindUniqueOrThrowArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvitationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, InvitationFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<
        Prisma.$InvitationPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find the first Invitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindFirstArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvitationFindFirstArgs>(
      args?: SelectSubset<T, InvitationFindFirstArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<
        Prisma.$InvitationPayload<ExtArgs>,
        T,
        'findFirst'
      > | null,
      null,
      ExtArgs
    >;

    /**
     * Find the first Invitation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindFirstOrThrowArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvitationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, InvitationFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<
        Prisma.$InvitationPayload<ExtArgs>,
        T,
        'findFirstOrThrow'
      >,
      never,
      ExtArgs
    >;

    /**
     * Find zero or more Invitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invitations
     * const invitations = await prisma.invitation.findMany()
     *
     * // Get first 10 Invitations
     * const invitations = await prisma.invitation.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const invitationWithIdOnly = await prisma.invitation.findMany({ select: { id: true } })
     *
     */
    findMany<T extends InvitationFindManyArgs>(
      args?: SelectSubset<T, InvitationFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'findMany'>
    >;

    /**
     * Create a Invitation.
     * @param {InvitationCreateArgs} args - Arguments to create a Invitation.
     * @example
     * // Create one Invitation
     * const Invitation = await prisma.invitation.create({
     *   data: {
     *     // ... data to create a Invitation
     *   }
     * })
     *
     */
    create<T extends InvitationCreateArgs>(
      args: SelectSubset<T, InvitationCreateArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'create'>,
      never,
      ExtArgs
    >;

    /**
     * Create many Invitations.
     * @param {InvitationCreateManyArgs} args - Arguments to create many Invitations.
     * @example
     * // Create many Invitations
     * const invitation = await prisma.invitation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends InvitationCreateManyArgs>(
      args?: SelectSubset<T, InvitationCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Invitations and returns the data saved in the database.
     * @param {InvitationCreateManyAndReturnArgs} args - Arguments to create many Invitations.
     * @example
     * // Create many Invitations
     * const invitation = await prisma.invitation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Invitations and only return the `id`
     * const invitationWithIdOnly = await prisma.invitation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends InvitationCreateManyAndReturnArgs>(
      args?: SelectSubset<T, InvitationCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$InvitationPayload<ExtArgs>,
        T,
        'createManyAndReturn'
      >
    >;

    /**
     * Delete a Invitation.
     * @param {InvitationDeleteArgs} args - Arguments to delete one Invitation.
     * @example
     * // Delete one Invitation
     * const Invitation = await prisma.invitation.delete({
     *   where: {
     *     // ... filter to delete one Invitation
     *   }
     * })
     *
     */
    delete<T extends InvitationDeleteArgs>(
      args: SelectSubset<T, InvitationDeleteArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'delete'>,
      never,
      ExtArgs
    >;

    /**
     * Update one Invitation.
     * @param {InvitationUpdateArgs} args - Arguments to update one Invitation.
     * @example
     * // Update one Invitation
     * const invitation = await prisma.invitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends InvitationUpdateArgs>(
      args: SelectSubset<T, InvitationUpdateArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'update'>,
      never,
      ExtArgs
    >;

    /**
     * Delete zero or more Invitations.
     * @param {InvitationDeleteManyArgs} args - Arguments to filter Invitations to delete.
     * @example
     * // Delete a few Invitations
     * const { count } = await prisma.invitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends InvitationDeleteManyArgs>(
      args?: SelectSubset<T, InvitationDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Invitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invitations
     * const invitation = await prisma.invitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends InvitationUpdateManyArgs>(
      args: SelectSubset<T, InvitationUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create or update one Invitation.
     * @param {InvitationUpsertArgs} args - Arguments to update or create a Invitation.
     * @example
     * // Update or create a Invitation
     * const invitation = await prisma.invitation.upsert({
     *   create: {
     *     // ... data to create a Invitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invitation we want to update
     *   }
     * })
     */
    upsert<T extends InvitationUpsertArgs>(
      args: SelectSubset<T, InvitationUpsertArgs<ExtArgs>>
    ): Prisma__InvitationClient<
      $Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, 'upsert'>,
      never,
      ExtArgs
    >;

    /**
     * Count the number of Invitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationCountArgs} args - Arguments to filter Invitations to count.
     * @example
     * // Count the number of Invitations
     * const count = await prisma.invitation.count({
     *   where: {
     *     // ... the filter for the Invitations we want to count
     *   }
     * })
     **/
    count<T extends InvitationCountArgs>(
      args?: Subset<T, InvitationCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvitationCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Invitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends InvitationAggregateArgs>(
      args: Subset<T, InvitationAggregateArgs>
    ): Prisma.PrismaPromise<GetInvitationAggregateType<T>>;

    /**
     * Group by Invitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends InvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvitationGroupByArgs['orderBy'] }
        : { orderBy?: InvitationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, InvitationGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetInvitationGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Invitation model
     */
    readonly fields: InvitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvitationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    inviter<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>
    ): Prisma__UserClient<
      | $Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>
      | Null,
      Null,
      ExtArgs
    >;
    invitee<T extends Invitation$inviteeArgs<ExtArgs> = {}>(
      args?: Subset<T, Invitation$inviteeArgs<ExtArgs>>
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow'
      > | null,
      null,
      ExtArgs
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Invitation model
   */
  interface InvitationFieldRefs {
    readonly id: FieldRef<'Invitation', 'String'>;
    readonly email: FieldRef<'Invitation', 'String'>;
    readonly role: FieldRef<'Invitation', 'UserRole'>;
    readonly token: FieldRef<'Invitation', 'String'>;
    readonly expiresAt: FieldRef<'Invitation', 'DateTime'>;
    readonly acceptedAt: FieldRef<'Invitation', 'DateTime'>;
    readonly invitedBy: FieldRef<'Invitation', 'String'>;
    readonly createdAt: FieldRef<'Invitation', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Invitation findUnique
   */
  export type InvitationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * Filter, which Invitation to fetch.
     */
    where: InvitationWhereUniqueInput;
  };

  /**
   * Invitation findUniqueOrThrow
   */
  export type InvitationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * Filter, which Invitation to fetch.
     */
    where: InvitationWhereUniqueInput;
  };

  /**
   * Invitation findFirst
   */
  export type InvitationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * Filter, which Invitation to fetch.
     */
    where?: InvitationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Invitations to fetch.
     */
    orderBy?:
      | InvitationOrderByWithRelationInput
      | InvitationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Invitations.
     */
    cursor?: InvitationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Invitations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[];
  };

  /**
   * Invitation findFirstOrThrow
   */
  export type InvitationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * Filter, which Invitation to fetch.
     */
    where?: InvitationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Invitations to fetch.
     */
    orderBy?:
      | InvitationOrderByWithRelationInput
      | InvitationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Invitations.
     */
    cursor?: InvitationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Invitations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[];
  };

  /**
   * Invitation findMany
   */
  export type InvitationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * Filter, which Invitations to fetch.
     */
    where?: InvitationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Invitations to fetch.
     */
    orderBy?:
      | InvitationOrderByWithRelationInput
      | InvitationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Invitations.
     */
    cursor?: InvitationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Invitations.
     */
    skip?: number;
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[];
  };

  /**
   * Invitation create
   */
  export type InvitationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * The data needed to create a Invitation.
     */
    data: XOR<InvitationCreateInput, InvitationUncheckedCreateInput>;
  };

  /**
   * Invitation createMany
   */
  export type InvitationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Invitations.
     */
    data: InvitationCreateManyInput | InvitationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Invitation createManyAndReturn
   */
  export type InvitationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * The data used to create many Invitations.
     */
    data: InvitationCreateManyInput | InvitationCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Invitation update
   */
  export type InvitationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * The data needed to update a Invitation.
     */
    data: XOR<InvitationUpdateInput, InvitationUncheckedUpdateInput>;
    /**
     * Choose, which Invitation to update.
     */
    where: InvitationWhereUniqueInput;
  };

  /**
   * Invitation updateMany
   */
  export type InvitationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Invitations.
     */
    data: XOR<
      InvitationUpdateManyMutationInput,
      InvitationUncheckedUpdateManyInput
    >;
    /**
     * Filter which Invitations to update
     */
    where?: InvitationWhereInput;
  };

  /**
   * Invitation upsert
   */
  export type InvitationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * The filter to search for the Invitation to update in case it exists.
     */
    where: InvitationWhereUniqueInput;
    /**
     * In case the Invitation found by the `where` argument doesn't exist, create a new Invitation with this data.
     */
    create: XOR<InvitationCreateInput, InvitationUncheckedCreateInput>;
    /**
     * In case the Invitation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvitationUpdateInput, InvitationUncheckedUpdateInput>;
  };

  /**
   * Invitation delete
   */
  export type InvitationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
    /**
     * Filter which Invitation to delete.
     */
    where: InvitationWhereUniqueInput;
  };

  /**
   * Invitation deleteMany
   */
  export type InvitationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Invitations to delete
     */
    where?: InvitationWhereInput;
  };

  /**
   * Invitation.invitee
   */
  export type Invitation$inviteeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };

  /**
   * Invitation without action
   */
  export type InvitationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UserScalarFieldEnum: {
    id: 'id';
    email: 'email';
    name: 'name';
    role: 'role';
    isActive: 'isActive';
    lastLoginAt: 'lastLoginAt';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type UserScalarFieldEnum =
    (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const EventScalarFieldEnum: {
    id: 'id';
    title: 'title';
    slug: 'slug';
    description: 'description';
    shortDescription: 'shortDescription';
    status: 'status';
    startDate: 'startDate';
    endDate: 'endDate';
    capacity: 'capacity';
    currentWaitlist: 'currentWaitlist';
    youtubeUrl: 'youtubeUrl';
    mapLat: 'mapLat';
    mapLng: 'mapLng';
    mapZoom: 'mapZoom';
    mapAddress: 'mapAddress';
    ownerId: 'ownerId';
    venueId: 'venueId';
    categoryId: 'categoryId';
    isPublic: 'isPublic';
    featured: 'featured';
    tags: 'tags';
    metadata: 'metadata';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type EventScalarFieldEnum =
    (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];

  export const VenueScalarFieldEnum: {
    id: 'id';
    name: 'name';
    address: 'address';
    city: 'city';
    country: 'country';
    latitude: 'latitude';
    longitude: 'longitude';
    website: 'website';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type VenueScalarFieldEnum =
    (typeof VenueScalarFieldEnum)[keyof typeof VenueScalarFieldEnum];

  export const WaitlistEntryScalarFieldEnum: {
    id: 'id';
    email: 'email';
    eventId: 'eventId';
    userId: 'userId';
    status: 'status';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type WaitlistEntryScalarFieldEnum =
    (typeof WaitlistEntryScalarFieldEnum)[keyof typeof WaitlistEntryScalarFieldEnum];

  export const SessionScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    token: 'token';
    expiresAt: 'expiresAt';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type SessionScalarFieldEnum =
    (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum];

  export const AuditLogScalarFieldEnum: {
    id: 'id';
    action: 'action';
    resource: 'resource';
    resourceId: 'resourceId';
    userId: 'userId';
    ipAddress: 'ipAddress';
    userAgent: 'userAgent';
    metadata: 'metadata';
    createdAt: 'createdAt';
  };

  export type AuditLogScalarFieldEnum =
    (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];

  export const ShowScalarFieldEnum: {
    id: 'id';
    title: 'title';
    description: 'description';
    startDate: 'startDate';
    endDate: 'endDate';
    capacity: 'capacity';
    currentWaitlist: 'currentWaitlist';
    youtubeUrl: 'youtubeUrl';
    eventId: 'eventId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type ShowScalarFieldEnum =
    (typeof ShowScalarFieldEnum)[keyof typeof ShowScalarFieldEnum];

  export const CategoryScalarFieldEnum: {
    id: 'id';
    name: 'name';
    slug: 'slug';
    description: 'description';
    color: 'color';
    icon: 'icon';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    deletedAt: 'deletedAt';
  };

  export type CategoryScalarFieldEnum =
    (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];

  export const EmailVerificationScalarFieldEnum: {
    id: 'id';
    email: 'email';
    token: 'token';
    type: 'type';
    expiresAt: 'expiresAt';
    verifiedAt: 'verifiedAt';
    userId: 'userId';
    createdAt: 'createdAt';
  };

  export type EmailVerificationScalarFieldEnum =
    (typeof EmailVerificationScalarFieldEnum)[keyof typeof EmailVerificationScalarFieldEnum];

  export const ConsentScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    type: 'type';
    granted: 'granted';
    grantedAt: 'grantedAt';
    ipAddress: 'ipAddress';
    userAgent: 'userAgent';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type ConsentScalarFieldEnum =
    (typeof ConsentScalarFieldEnum)[keyof typeof ConsentScalarFieldEnum];

  export const NearbyPlaceScalarFieldEnum: {
    id: 'id';
    name: 'name';
    address: 'address';
    latitude: 'latitude';
    longitude: 'longitude';
    category: 'category';
    rating: 'rating';
    website: 'website';
    phone: 'phone';
    distance: 'distance';
    eventId: 'eventId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type NearbyPlaceScalarFieldEnum =
    (typeof NearbyPlaceScalarFieldEnum)[keyof typeof NearbyPlaceScalarFieldEnum];

  export const InvitationScalarFieldEnum: {
    id: 'id';
    email: 'email';
    role: 'role';
    token: 'token';
    expiresAt: 'expiresAt';
    acceptedAt: 'acceptedAt';
    invitedBy: 'invitedBy';
    createdAt: 'createdAt';
  };

  export type InvitationScalarFieldEnum =
    (typeof InvitationScalarFieldEnum)[keyof typeof InvitationScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
  };

  export type NullableJsonNullValueInput =
    (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter =
    (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'UserRole'
  >;

  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'UserRole[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'EventStatus'
   */
  export type EnumEventStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'EventStatus'
  >;

  /**
   * Reference to a field of type 'EventStatus[]'
   */
  export type ListEnumEventStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'EventStatus[]'>;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >;

  /**
   * Reference to a field of type 'WaitlistStatus'
   */
  export type EnumWaitlistStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'WaitlistStatus'
  >;

  /**
   * Reference to a field of type 'WaitlistStatus[]'
   */
  export type ListEnumWaitlistStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'WaitlistStatus[]'>;

  /**
   * Reference to a field of type 'EmailVerificationType'
   */
  export type EnumEmailVerificationTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'EmailVerificationType'>;

  /**
   * Reference to a field of type 'EmailVerificationType[]'
   */
  export type ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'EmailVerificationType[]'>;

  /**
   * Reference to a field of type 'ConsentType'
   */
  export type EnumConsentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'ConsentType'
  >;

  /**
   * Reference to a field of type 'ConsentType[]'
   */
  export type ListEnumConsentTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'ConsentType[]'>;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    email?: StringFilter<'User'> | string;
    name?: StringNullableFilter<'User'> | string | null;
    role?: EnumUserRoleFilter<'User'> | $Enums.UserRole;
    isActive?: BoolFilter<'User'> | boolean;
    lastLoginAt?: DateTimeNullableFilter<'User'> | Date | string | null;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    updatedAt?: DateTimeFilter<'User'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'User'> | Date | string | null;
    ownedEvents?: EventListRelationFilter;
    waitlistEntries?: WaitlistEntryListRelationFilter;
    sessions?: SessionListRelationFilter;
    auditLogs?: AuditLogListRelationFilter;
    emailVerifications?: EmailVerificationListRelationFilter;
    consents?: ConsentListRelationFilter;
    invitationsSent?: InvitationListRelationFilter;
    invitationsReceived?: InvitationListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    name?: SortOrderInput | SortOrder;
    role?: SortOrder;
    isActive?: SortOrder;
    lastLoginAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    ownedEvents?: EventOrderByRelationAggregateInput;
    waitlistEntries?: WaitlistEntryOrderByRelationAggregateInput;
    sessions?: SessionOrderByRelationAggregateInput;
    auditLogs?: AuditLogOrderByRelationAggregateInput;
    emailVerifications?: EmailVerificationOrderByRelationAggregateInput;
    consents?: ConsentOrderByRelationAggregateInput;
    invitationsSent?: InvitationOrderByRelationAggregateInput;
    invitationsReceived?: InvitationOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      name?: StringNullableFilter<'User'> | string | null;
      role?: EnumUserRoleFilter<'User'> | $Enums.UserRole;
      isActive?: BoolFilter<'User'> | boolean;
      lastLoginAt?: DateTimeNullableFilter<'User'> | Date | string | null;
      createdAt?: DateTimeFilter<'User'> | Date | string;
      updatedAt?: DateTimeFilter<'User'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'User'> | Date | string | null;
      ownedEvents?: EventListRelationFilter;
      waitlistEntries?: WaitlistEntryListRelationFilter;
      sessions?: SessionListRelationFilter;
      auditLogs?: AuditLogListRelationFilter;
      emailVerifications?: EmailVerificationListRelationFilter;
      consents?: ConsentListRelationFilter;
      invitationsSent?: InvitationListRelationFilter;
      invitationsReceived?: InvitationListRelationFilter;
    },
    'id' | 'email'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    name?: SortOrderInput | SortOrder;
    role?: SortOrder;
    isActive?: SortOrder;
    lastLoginAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    email?: StringWithAggregatesFilter<'User'> | string;
    name?: StringNullableWithAggregatesFilter<'User'> | string | null;
    role?: EnumUserRoleWithAggregatesFilter<'User'> | $Enums.UserRole;
    isActive?: BoolWithAggregatesFilter<'User'> | boolean;
    lastLoginAt?:
      | DateTimeNullableWithAggregatesFilter<'User'>
      | Date
      | string
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'User'>
      | Date
      | string
      | null;
  };

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[];
    OR?: EventWhereInput[];
    NOT?: EventWhereInput | EventWhereInput[];
    id?: StringFilter<'Event'> | string;
    title?: StringFilter<'Event'> | string;
    slug?: StringFilter<'Event'> | string;
    description?: StringNullableFilter<'Event'> | string | null;
    shortDescription?: StringNullableFilter<'Event'> | string | null;
    status?: EnumEventStatusFilter<'Event'> | $Enums.EventStatus;
    startDate?: DateTimeFilter<'Event'> | Date | string;
    endDate?: DateTimeNullableFilter<'Event'> | Date | string | null;
    capacity?: IntNullableFilter<'Event'> | number | null;
    currentWaitlist?: IntFilter<'Event'> | number;
    youtubeUrl?: StringNullableFilter<'Event'> | string | null;
    mapLat?: FloatNullableFilter<'Event'> | number | null;
    mapLng?: FloatNullableFilter<'Event'> | number | null;
    mapZoom?: IntNullableFilter<'Event'> | number | null;
    mapAddress?: StringNullableFilter<'Event'> | string | null;
    ownerId?: StringFilter<'Event'> | string;
    venueId?: StringNullableFilter<'Event'> | string | null;
    categoryId?: StringNullableFilter<'Event'> | string | null;
    isPublic?: BoolFilter<'Event'> | boolean;
    featured?: BoolFilter<'Event'> | boolean;
    tags?: StringNullableListFilter<'Event'>;
    metadata?: JsonNullableFilter<'Event'>;
    createdAt?: DateTimeFilter<'Event'> | Date | string;
    updatedAt?: DateTimeFilter<'Event'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Event'> | Date | string | null;
    owner?: XOR<UserRelationFilter, UserWhereInput>;
    venue?: XOR<VenueNullableRelationFilter, VenueWhereInput> | null;
    category?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null;
    waitlist?: WaitlistEntryListRelationFilter;
    shows?: ShowListRelationFilter;
    nearbyPlaces?: NearbyPlaceListRelationFilter;
  };

  export type EventOrderByWithRelationInput = {
    id?: SortOrder;
    title?: SortOrder;
    slug?: SortOrder;
    description?: SortOrderInput | SortOrder;
    shortDescription?: SortOrderInput | SortOrder;
    status?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrderInput | SortOrder;
    capacity?: SortOrderInput | SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrderInput | SortOrder;
    mapLat?: SortOrderInput | SortOrder;
    mapLng?: SortOrderInput | SortOrder;
    mapZoom?: SortOrderInput | SortOrder;
    mapAddress?: SortOrderInput | SortOrder;
    ownerId?: SortOrder;
    venueId?: SortOrderInput | SortOrder;
    categoryId?: SortOrderInput | SortOrder;
    isPublic?: SortOrder;
    featured?: SortOrder;
    tags?: SortOrder;
    metadata?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    owner?: UserOrderByWithRelationInput;
    venue?: VenueOrderByWithRelationInput;
    category?: CategoryOrderByWithRelationInput;
    waitlist?: WaitlistEntryOrderByRelationAggregateInput;
    shows?: ShowOrderByRelationAggregateInput;
    nearbyPlaces?: NearbyPlaceOrderByRelationAggregateInput;
  };

  export type EventWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      slug?: string;
      AND?: EventWhereInput | EventWhereInput[];
      OR?: EventWhereInput[];
      NOT?: EventWhereInput | EventWhereInput[];
      title?: StringFilter<'Event'> | string;
      description?: StringNullableFilter<'Event'> | string | null;
      shortDescription?: StringNullableFilter<'Event'> | string | null;
      status?: EnumEventStatusFilter<'Event'> | $Enums.EventStatus;
      startDate?: DateTimeFilter<'Event'> | Date | string;
      endDate?: DateTimeNullableFilter<'Event'> | Date | string | null;
      capacity?: IntNullableFilter<'Event'> | number | null;
      currentWaitlist?: IntFilter<'Event'> | number;
      youtubeUrl?: StringNullableFilter<'Event'> | string | null;
      mapLat?: FloatNullableFilter<'Event'> | number | null;
      mapLng?: FloatNullableFilter<'Event'> | number | null;
      mapZoom?: IntNullableFilter<'Event'> | number | null;
      mapAddress?: StringNullableFilter<'Event'> | string | null;
      ownerId?: StringFilter<'Event'> | string;
      venueId?: StringNullableFilter<'Event'> | string | null;
      categoryId?: StringNullableFilter<'Event'> | string | null;
      isPublic?: BoolFilter<'Event'> | boolean;
      featured?: BoolFilter<'Event'> | boolean;
      tags?: StringNullableListFilter<'Event'>;
      metadata?: JsonNullableFilter<'Event'>;
      createdAt?: DateTimeFilter<'Event'> | Date | string;
      updatedAt?: DateTimeFilter<'Event'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'Event'> | Date | string | null;
      owner?: XOR<UserRelationFilter, UserWhereInput>;
      venue?: XOR<VenueNullableRelationFilter, VenueWhereInput> | null;
      category?: XOR<CategoryNullableRelationFilter, CategoryWhereInput> | null;
      waitlist?: WaitlistEntryListRelationFilter;
      shows?: ShowListRelationFilter;
      nearbyPlaces?: NearbyPlaceListRelationFilter;
    },
    'id' | 'slug'
  >;

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder;
    title?: SortOrder;
    slug?: SortOrder;
    description?: SortOrderInput | SortOrder;
    shortDescription?: SortOrderInput | SortOrder;
    status?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrderInput | SortOrder;
    capacity?: SortOrderInput | SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrderInput | SortOrder;
    mapLat?: SortOrderInput | SortOrder;
    mapLng?: SortOrderInput | SortOrder;
    mapZoom?: SortOrderInput | SortOrder;
    mapAddress?: SortOrderInput | SortOrder;
    ownerId?: SortOrder;
    venueId?: SortOrderInput | SortOrder;
    categoryId?: SortOrderInput | SortOrder;
    isPublic?: SortOrder;
    featured?: SortOrder;
    tags?: SortOrder;
    metadata?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: EventCountOrderByAggregateInput;
    _avg?: EventAvgOrderByAggregateInput;
    _max?: EventMaxOrderByAggregateInput;
    _min?: EventMinOrderByAggregateInput;
    _sum?: EventSumOrderByAggregateInput;
  };

  export type EventScalarWhereWithAggregatesInput = {
    AND?:
      | EventScalarWhereWithAggregatesInput
      | EventScalarWhereWithAggregatesInput[];
    OR?: EventScalarWhereWithAggregatesInput[];
    NOT?:
      | EventScalarWhereWithAggregatesInput
      | EventScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Event'> | string;
    title?: StringWithAggregatesFilter<'Event'> | string;
    slug?: StringWithAggregatesFilter<'Event'> | string;
    description?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    shortDescription?:
      | StringNullableWithAggregatesFilter<'Event'>
      | string
      | null;
    status?: EnumEventStatusWithAggregatesFilter<'Event'> | $Enums.EventStatus;
    startDate?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
    endDate?:
      | DateTimeNullableWithAggregatesFilter<'Event'>
      | Date
      | string
      | null;
    capacity?: IntNullableWithAggregatesFilter<'Event'> | number | null;
    currentWaitlist?: IntWithAggregatesFilter<'Event'> | number;
    youtubeUrl?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    mapLat?: FloatNullableWithAggregatesFilter<'Event'> | number | null;
    mapLng?: FloatNullableWithAggregatesFilter<'Event'> | number | null;
    mapZoom?: IntNullableWithAggregatesFilter<'Event'> | number | null;
    mapAddress?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    ownerId?: StringWithAggregatesFilter<'Event'> | string;
    venueId?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    categoryId?: StringNullableWithAggregatesFilter<'Event'> | string | null;
    isPublic?: BoolWithAggregatesFilter<'Event'> | boolean;
    featured?: BoolWithAggregatesFilter<'Event'> | boolean;
    tags?: StringNullableListFilter<'Event'>;
    metadata?: JsonNullableWithAggregatesFilter<'Event'>;
    createdAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Event'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'Event'>
      | Date
      | string
      | null;
  };

  export type VenueWhereInput = {
    AND?: VenueWhereInput | VenueWhereInput[];
    OR?: VenueWhereInput[];
    NOT?: VenueWhereInput | VenueWhereInput[];
    id?: StringFilter<'Venue'> | string;
    name?: StringFilter<'Venue'> | string;
    address?: StringFilter<'Venue'> | string;
    city?: StringFilter<'Venue'> | string;
    country?: StringFilter<'Venue'> | string;
    latitude?: FloatNullableFilter<'Venue'> | number | null;
    longitude?: FloatNullableFilter<'Venue'> | number | null;
    website?: StringNullableFilter<'Venue'> | string | null;
    createdAt?: DateTimeFilter<'Venue'> | Date | string;
    updatedAt?: DateTimeFilter<'Venue'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Venue'> | Date | string | null;
    events?: EventListRelationFilter;
  };

  export type VenueOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    city?: SortOrder;
    country?: SortOrder;
    latitude?: SortOrderInput | SortOrder;
    longitude?: SortOrderInput | SortOrder;
    website?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    events?: EventOrderByRelationAggregateInput;
  };

  export type VenueWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      name?: string;
      AND?: VenueWhereInput | VenueWhereInput[];
      OR?: VenueWhereInput[];
      NOT?: VenueWhereInput | VenueWhereInput[];
      address?: StringFilter<'Venue'> | string;
      city?: StringFilter<'Venue'> | string;
      country?: StringFilter<'Venue'> | string;
      latitude?: FloatNullableFilter<'Venue'> | number | null;
      longitude?: FloatNullableFilter<'Venue'> | number | null;
      website?: StringNullableFilter<'Venue'> | string | null;
      createdAt?: DateTimeFilter<'Venue'> | Date | string;
      updatedAt?: DateTimeFilter<'Venue'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'Venue'> | Date | string | null;
      events?: EventListRelationFilter;
    },
    'id' | 'name'
  >;

  export type VenueOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    city?: SortOrder;
    country?: SortOrder;
    latitude?: SortOrderInput | SortOrder;
    longitude?: SortOrderInput | SortOrder;
    website?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: VenueCountOrderByAggregateInput;
    _avg?: VenueAvgOrderByAggregateInput;
    _max?: VenueMaxOrderByAggregateInput;
    _min?: VenueMinOrderByAggregateInput;
    _sum?: VenueSumOrderByAggregateInput;
  };

  export type VenueScalarWhereWithAggregatesInput = {
    AND?:
      | VenueScalarWhereWithAggregatesInput
      | VenueScalarWhereWithAggregatesInput[];
    OR?: VenueScalarWhereWithAggregatesInput[];
    NOT?:
      | VenueScalarWhereWithAggregatesInput
      | VenueScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Venue'> | string;
    name?: StringWithAggregatesFilter<'Venue'> | string;
    address?: StringWithAggregatesFilter<'Venue'> | string;
    city?: StringWithAggregatesFilter<'Venue'> | string;
    country?: StringWithAggregatesFilter<'Venue'> | string;
    latitude?: FloatNullableWithAggregatesFilter<'Venue'> | number | null;
    longitude?: FloatNullableWithAggregatesFilter<'Venue'> | number | null;
    website?: StringNullableWithAggregatesFilter<'Venue'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Venue'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Venue'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'Venue'>
      | Date
      | string
      | null;
  };

  export type WaitlistEntryWhereInput = {
    AND?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[];
    OR?: WaitlistEntryWhereInput[];
    NOT?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[];
    id?: StringFilter<'WaitlistEntry'> | string;
    email?: StringFilter<'WaitlistEntry'> | string;
    eventId?: StringFilter<'WaitlistEntry'> | string;
    userId?: StringNullableFilter<'WaitlistEntry'> | string | null;
    status?: EnumWaitlistStatusFilter<'WaitlistEntry'> | $Enums.WaitlistStatus;
    createdAt?: DateTimeFilter<'WaitlistEntry'> | Date | string;
    updatedAt?: DateTimeFilter<'WaitlistEntry'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'WaitlistEntry'> | Date | string | null;
    event?: XOR<EventRelationFilter, EventWhereInput>;
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
  };

  export type WaitlistEntryOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    eventId?: SortOrder;
    userId?: SortOrderInput | SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    event?: EventOrderByWithRelationInput;
    user?: UserOrderByWithRelationInput;
  };

  export type WaitlistEntryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email_eventId?: WaitlistEntryEmailEventIdCompoundUniqueInput;
      AND?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[];
      OR?: WaitlistEntryWhereInput[];
      NOT?: WaitlistEntryWhereInput | WaitlistEntryWhereInput[];
      email?: StringFilter<'WaitlistEntry'> | string;
      eventId?: StringFilter<'WaitlistEntry'> | string;
      userId?: StringNullableFilter<'WaitlistEntry'> | string | null;
      status?:
        | EnumWaitlistStatusFilter<'WaitlistEntry'>
        | $Enums.WaitlistStatus;
      createdAt?: DateTimeFilter<'WaitlistEntry'> | Date | string;
      updatedAt?: DateTimeFilter<'WaitlistEntry'> | Date | string;
      deletedAt?:
        | DateTimeNullableFilter<'WaitlistEntry'>
        | Date
        | string
        | null;
      event?: XOR<EventRelationFilter, EventWhereInput>;
      user?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
    },
    'id' | 'email_eventId'
  >;

  export type WaitlistEntryOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    eventId?: SortOrder;
    userId?: SortOrderInput | SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: WaitlistEntryCountOrderByAggregateInput;
    _max?: WaitlistEntryMaxOrderByAggregateInput;
    _min?: WaitlistEntryMinOrderByAggregateInput;
  };

  export type WaitlistEntryScalarWhereWithAggregatesInput = {
    AND?:
      | WaitlistEntryScalarWhereWithAggregatesInput
      | WaitlistEntryScalarWhereWithAggregatesInput[];
    OR?: WaitlistEntryScalarWhereWithAggregatesInput[];
    NOT?:
      | WaitlistEntryScalarWhereWithAggregatesInput
      | WaitlistEntryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'WaitlistEntry'> | string;
    email?: StringWithAggregatesFilter<'WaitlistEntry'> | string;
    eventId?: StringWithAggregatesFilter<'WaitlistEntry'> | string;
    userId?:
      | StringNullableWithAggregatesFilter<'WaitlistEntry'>
      | string
      | null;
    status?:
      | EnumWaitlistStatusWithAggregatesFilter<'WaitlistEntry'>
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeWithAggregatesFilter<'WaitlistEntry'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'WaitlistEntry'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'WaitlistEntry'>
      | Date
      | string
      | null;
  };

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[];
    OR?: SessionWhereInput[];
    NOT?: SessionWhereInput | SessionWhereInput[];
    id?: StringFilter<'Session'> | string;
    userId?: StringFilter<'Session'> | string;
    token?: StringFilter<'Session'> | string;
    expiresAt?: DateTimeFilter<'Session'> | Date | string;
    createdAt?: DateTimeFilter<'Session'> | Date | string;
    updatedAt?: DateTimeFilter<'Session'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Session'> | Date | string | null;
    user?: XOR<UserRelationFilter, UserWhereInput>;
  };

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type SessionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      token?: string;
      AND?: SessionWhereInput | SessionWhereInput[];
      OR?: SessionWhereInput[];
      NOT?: SessionWhereInput | SessionWhereInput[];
      userId?: StringFilter<'Session'> | string;
      expiresAt?: DateTimeFilter<'Session'> | Date | string;
      createdAt?: DateTimeFilter<'Session'> | Date | string;
      updatedAt?: DateTimeFilter<'Session'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'Session'> | Date | string | null;
      user?: XOR<UserRelationFilter, UserWhereInput>;
    },
    'id' | 'token'
  >;

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: SessionCountOrderByAggregateInput;
    _max?: SessionMaxOrderByAggregateInput;
    _min?: SessionMinOrderByAggregateInput;
  };

  export type SessionScalarWhereWithAggregatesInput = {
    AND?:
      | SessionScalarWhereWithAggregatesInput
      | SessionScalarWhereWithAggregatesInput[];
    OR?: SessionScalarWhereWithAggregatesInput[];
    NOT?:
      | SessionScalarWhereWithAggregatesInput
      | SessionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Session'> | string;
    userId?: StringWithAggregatesFilter<'Session'> | string;
    token?: StringWithAggregatesFilter<'Session'> | string;
    expiresAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    createdAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Session'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'Session'>
      | Date
      | string
      | null;
  };

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[];
    OR?: AuditLogWhereInput[];
    NOT?: AuditLogWhereInput | AuditLogWhereInput[];
    id?: StringFilter<'AuditLog'> | string;
    action?: StringFilter<'AuditLog'> | string;
    resource?: StringFilter<'AuditLog'> | string;
    resourceId?: StringFilter<'AuditLog'> | string;
    userId?: StringNullableFilter<'AuditLog'> | string | null;
    ipAddress?: StringNullableFilter<'AuditLog'> | string | null;
    userAgent?: StringNullableFilter<'AuditLog'> | string | null;
    metadata?: JsonNullableFilter<'AuditLog'>;
    createdAt?: DateTimeFilter<'AuditLog'> | Date | string;
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
  };

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder;
    action?: SortOrder;
    resource?: SortOrder;
    resourceId?: SortOrder;
    userId?: SortOrderInput | SortOrder;
    ipAddress?: SortOrderInput | SortOrder;
    userAgent?: SortOrderInput | SortOrder;
    metadata?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AuditLogWhereInput | AuditLogWhereInput[];
      OR?: AuditLogWhereInput[];
      NOT?: AuditLogWhereInput | AuditLogWhereInput[];
      action?: StringFilter<'AuditLog'> | string;
      resource?: StringFilter<'AuditLog'> | string;
      resourceId?: StringFilter<'AuditLog'> | string;
      userId?: StringNullableFilter<'AuditLog'> | string | null;
      ipAddress?: StringNullableFilter<'AuditLog'> | string | null;
      userAgent?: StringNullableFilter<'AuditLog'> | string | null;
      metadata?: JsonNullableFilter<'AuditLog'>;
      createdAt?: DateTimeFilter<'AuditLog'> | Date | string;
      user?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
    },
    'id'
  >;

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder;
    action?: SortOrder;
    resource?: SortOrder;
    resourceId?: SortOrder;
    userId?: SortOrderInput | SortOrder;
    ipAddress?: SortOrderInput | SortOrder;
    userAgent?: SortOrderInput | SortOrder;
    metadata?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: AuditLogCountOrderByAggregateInput;
    _max?: AuditLogMaxOrderByAggregateInput;
    _min?: AuditLogMinOrderByAggregateInput;
  };

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?:
      | AuditLogScalarWhereWithAggregatesInput
      | AuditLogScalarWhereWithAggregatesInput[];
    OR?: AuditLogScalarWhereWithAggregatesInput[];
    NOT?:
      | AuditLogScalarWhereWithAggregatesInput
      | AuditLogScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'AuditLog'> | string;
    action?: StringWithAggregatesFilter<'AuditLog'> | string;
    resource?: StringWithAggregatesFilter<'AuditLog'> | string;
    resourceId?: StringWithAggregatesFilter<'AuditLog'> | string;
    userId?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null;
    ipAddress?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null;
    userAgent?: StringNullableWithAggregatesFilter<'AuditLog'> | string | null;
    metadata?: JsonNullableWithAggregatesFilter<'AuditLog'>;
    createdAt?: DateTimeWithAggregatesFilter<'AuditLog'> | Date | string;
  };

  export type ShowWhereInput = {
    AND?: ShowWhereInput | ShowWhereInput[];
    OR?: ShowWhereInput[];
    NOT?: ShowWhereInput | ShowWhereInput[];
    id?: StringFilter<'Show'> | string;
    title?: StringFilter<'Show'> | string;
    description?: StringNullableFilter<'Show'> | string | null;
    startDate?: DateTimeFilter<'Show'> | Date | string;
    endDate?: DateTimeNullableFilter<'Show'> | Date | string | null;
    capacity?: IntNullableFilter<'Show'> | number | null;
    currentWaitlist?: IntFilter<'Show'> | number;
    youtubeUrl?: StringNullableFilter<'Show'> | string | null;
    eventId?: StringFilter<'Show'> | string;
    createdAt?: DateTimeFilter<'Show'> | Date | string;
    updatedAt?: DateTimeFilter<'Show'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Show'> | Date | string | null;
    event?: XOR<EventRelationFilter, EventWhereInput>;
  };

  export type ShowOrderByWithRelationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrderInput | SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrderInput | SortOrder;
    capacity?: SortOrderInput | SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrderInput | SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    event?: EventOrderByWithRelationInput;
  };

  export type ShowWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ShowWhereInput | ShowWhereInput[];
      OR?: ShowWhereInput[];
      NOT?: ShowWhereInput | ShowWhereInput[];
      title?: StringFilter<'Show'> | string;
      description?: StringNullableFilter<'Show'> | string | null;
      startDate?: DateTimeFilter<'Show'> | Date | string;
      endDate?: DateTimeNullableFilter<'Show'> | Date | string | null;
      capacity?: IntNullableFilter<'Show'> | number | null;
      currentWaitlist?: IntFilter<'Show'> | number;
      youtubeUrl?: StringNullableFilter<'Show'> | string | null;
      eventId?: StringFilter<'Show'> | string;
      createdAt?: DateTimeFilter<'Show'> | Date | string;
      updatedAt?: DateTimeFilter<'Show'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'Show'> | Date | string | null;
      event?: XOR<EventRelationFilter, EventWhereInput>;
    },
    'id'
  >;

  export type ShowOrderByWithAggregationInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrderInput | SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrderInput | SortOrder;
    capacity?: SortOrderInput | SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrderInput | SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: ShowCountOrderByAggregateInput;
    _avg?: ShowAvgOrderByAggregateInput;
    _max?: ShowMaxOrderByAggregateInput;
    _min?: ShowMinOrderByAggregateInput;
    _sum?: ShowSumOrderByAggregateInput;
  };

  export type ShowScalarWhereWithAggregatesInput = {
    AND?:
      | ShowScalarWhereWithAggregatesInput
      | ShowScalarWhereWithAggregatesInput[];
    OR?: ShowScalarWhereWithAggregatesInput[];
    NOT?:
      | ShowScalarWhereWithAggregatesInput
      | ShowScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Show'> | string;
    title?: StringWithAggregatesFilter<'Show'> | string;
    description?: StringNullableWithAggregatesFilter<'Show'> | string | null;
    startDate?: DateTimeWithAggregatesFilter<'Show'> | Date | string;
    endDate?:
      | DateTimeNullableWithAggregatesFilter<'Show'>
      | Date
      | string
      | null;
    capacity?: IntNullableWithAggregatesFilter<'Show'> | number | null;
    currentWaitlist?: IntWithAggregatesFilter<'Show'> | number;
    youtubeUrl?: StringNullableWithAggregatesFilter<'Show'> | string | null;
    eventId?: StringWithAggregatesFilter<'Show'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Show'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Show'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'Show'>
      | Date
      | string
      | null;
  };

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[];
    OR?: CategoryWhereInput[];
    NOT?: CategoryWhereInput | CategoryWhereInput[];
    id?: StringFilter<'Category'> | string;
    name?: StringFilter<'Category'> | string;
    slug?: StringFilter<'Category'> | string;
    description?: StringNullableFilter<'Category'> | string | null;
    color?: StringNullableFilter<'Category'> | string | null;
    icon?: StringNullableFilter<'Category'> | string | null;
    isActive?: BoolFilter<'Category'> | boolean;
    createdAt?: DateTimeFilter<'Category'> | Date | string;
    updatedAt?: DateTimeFilter<'Category'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Category'> | Date | string | null;
    events?: EventListRelationFilter;
  };

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrderInput | SortOrder;
    color?: SortOrderInput | SortOrder;
    icon?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    events?: EventOrderByRelationAggregateInput;
  };

  export type CategoryWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      name?: string;
      slug?: string;
      AND?: CategoryWhereInput | CategoryWhereInput[];
      OR?: CategoryWhereInput[];
      NOT?: CategoryWhereInput | CategoryWhereInput[];
      description?: StringNullableFilter<'Category'> | string | null;
      color?: StringNullableFilter<'Category'> | string | null;
      icon?: StringNullableFilter<'Category'> | string | null;
      isActive?: BoolFilter<'Category'> | boolean;
      createdAt?: DateTimeFilter<'Category'> | Date | string;
      updatedAt?: DateTimeFilter<'Category'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'Category'> | Date | string | null;
      events?: EventListRelationFilter;
    },
    'id' | 'name' | 'slug'
  >;

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrderInput | SortOrder;
    color?: SortOrderInput | SortOrder;
    icon?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: CategoryCountOrderByAggregateInput;
    _max?: CategoryMaxOrderByAggregateInput;
    _min?: CategoryMinOrderByAggregateInput;
  };

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?:
      | CategoryScalarWhereWithAggregatesInput
      | CategoryScalarWhereWithAggregatesInput[];
    OR?: CategoryScalarWhereWithAggregatesInput[];
    NOT?:
      | CategoryScalarWhereWithAggregatesInput
      | CategoryScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Category'> | string;
    name?: StringWithAggregatesFilter<'Category'> | string;
    slug?: StringWithAggregatesFilter<'Category'> | string;
    description?:
      | StringNullableWithAggregatesFilter<'Category'>
      | string
      | null;
    color?: StringNullableWithAggregatesFilter<'Category'> | string | null;
    icon?: StringNullableWithAggregatesFilter<'Category'> | string | null;
    isActive?: BoolWithAggregatesFilter<'Category'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Category'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Category'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'Category'>
      | Date
      | string
      | null;
  };

  export type EmailVerificationWhereInput = {
    AND?: EmailVerificationWhereInput | EmailVerificationWhereInput[];
    OR?: EmailVerificationWhereInput[];
    NOT?: EmailVerificationWhereInput | EmailVerificationWhereInput[];
    id?: StringFilter<'EmailVerification'> | string;
    email?: StringFilter<'EmailVerification'> | string;
    token?: StringFilter<'EmailVerification'> | string;
    type?:
      | EnumEmailVerificationTypeFilter<'EmailVerification'>
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFilter<'EmailVerification'> | Date | string;
    verifiedAt?:
      | DateTimeNullableFilter<'EmailVerification'>
      | Date
      | string
      | null;
    userId?: StringNullableFilter<'EmailVerification'> | string | null;
    createdAt?: DateTimeFilter<'EmailVerification'> | Date | string;
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
  };

  export type EmailVerificationOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    token?: SortOrder;
    type?: SortOrder;
    expiresAt?: SortOrder;
    verifiedAt?: SortOrderInput | SortOrder;
    userId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type EmailVerificationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      token?: string;
      AND?: EmailVerificationWhereInput | EmailVerificationWhereInput[];
      OR?: EmailVerificationWhereInput[];
      NOT?: EmailVerificationWhereInput | EmailVerificationWhereInput[];
      email?: StringFilter<'EmailVerification'> | string;
      type?:
        | EnumEmailVerificationTypeFilter<'EmailVerification'>
        | $Enums.EmailVerificationType;
      expiresAt?: DateTimeFilter<'EmailVerification'> | Date | string;
      verifiedAt?:
        | DateTimeNullableFilter<'EmailVerification'>
        | Date
        | string
        | null;
      userId?: StringNullableFilter<'EmailVerification'> | string | null;
      createdAt?: DateTimeFilter<'EmailVerification'> | Date | string;
      user?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
    },
    'id' | 'token'
  >;

  export type EmailVerificationOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    token?: SortOrder;
    type?: SortOrder;
    expiresAt?: SortOrder;
    verifiedAt?: SortOrderInput | SortOrder;
    userId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: EmailVerificationCountOrderByAggregateInput;
    _max?: EmailVerificationMaxOrderByAggregateInput;
    _min?: EmailVerificationMinOrderByAggregateInput;
  };

  export type EmailVerificationScalarWhereWithAggregatesInput = {
    AND?:
      | EmailVerificationScalarWhereWithAggregatesInput
      | EmailVerificationScalarWhereWithAggregatesInput[];
    OR?: EmailVerificationScalarWhereWithAggregatesInput[];
    NOT?:
      | EmailVerificationScalarWhereWithAggregatesInput
      | EmailVerificationScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'EmailVerification'> | string;
    email?: StringWithAggregatesFilter<'EmailVerification'> | string;
    token?: StringWithAggregatesFilter<'EmailVerification'> | string;
    type?:
      | EnumEmailVerificationTypeWithAggregatesFilter<'EmailVerification'>
      | $Enums.EmailVerificationType;
    expiresAt?:
      | DateTimeWithAggregatesFilter<'EmailVerification'>
      | Date
      | string;
    verifiedAt?:
      | DateTimeNullableWithAggregatesFilter<'EmailVerification'>
      | Date
      | string
      | null;
    userId?:
      | StringNullableWithAggregatesFilter<'EmailVerification'>
      | string
      | null;
    createdAt?:
      | DateTimeWithAggregatesFilter<'EmailVerification'>
      | Date
      | string;
  };

  export type ConsentWhereInput = {
    AND?: ConsentWhereInput | ConsentWhereInput[];
    OR?: ConsentWhereInput[];
    NOT?: ConsentWhereInput | ConsentWhereInput[];
    id?: StringFilter<'Consent'> | string;
    userId?: StringFilter<'Consent'> | string;
    type?: EnumConsentTypeFilter<'Consent'> | $Enums.ConsentType;
    granted?: BoolFilter<'Consent'> | boolean;
    grantedAt?: DateTimeNullableFilter<'Consent'> | Date | string | null;
    ipAddress?: StringNullableFilter<'Consent'> | string | null;
    userAgent?: StringNullableFilter<'Consent'> | string | null;
    createdAt?: DateTimeFilter<'Consent'> | Date | string;
    updatedAt?: DateTimeFilter<'Consent'> | Date | string;
    user?: XOR<UserRelationFilter, UserWhereInput>;
  };

  export type ConsentOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    type?: SortOrder;
    granted?: SortOrder;
    grantedAt?: SortOrderInput | SortOrder;
    ipAddress?: SortOrderInput | SortOrder;
    userAgent?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type ConsentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId_type?: ConsentUserIdTypeCompoundUniqueInput;
      AND?: ConsentWhereInput | ConsentWhereInput[];
      OR?: ConsentWhereInput[];
      NOT?: ConsentWhereInput | ConsentWhereInput[];
      userId?: StringFilter<'Consent'> | string;
      type?: EnumConsentTypeFilter<'Consent'> | $Enums.ConsentType;
      granted?: BoolFilter<'Consent'> | boolean;
      grantedAt?: DateTimeNullableFilter<'Consent'> | Date | string | null;
      ipAddress?: StringNullableFilter<'Consent'> | string | null;
      userAgent?: StringNullableFilter<'Consent'> | string | null;
      createdAt?: DateTimeFilter<'Consent'> | Date | string;
      updatedAt?: DateTimeFilter<'Consent'> | Date | string;
      user?: XOR<UserRelationFilter, UserWhereInput>;
    },
    'id' | 'userId_type'
  >;

  export type ConsentOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    type?: SortOrder;
    granted?: SortOrder;
    grantedAt?: SortOrderInput | SortOrder;
    ipAddress?: SortOrderInput | SortOrder;
    userAgent?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: ConsentCountOrderByAggregateInput;
    _max?: ConsentMaxOrderByAggregateInput;
    _min?: ConsentMinOrderByAggregateInput;
  };

  export type ConsentScalarWhereWithAggregatesInput = {
    AND?:
      | ConsentScalarWhereWithAggregatesInput
      | ConsentScalarWhereWithAggregatesInput[];
    OR?: ConsentScalarWhereWithAggregatesInput[];
    NOT?:
      | ConsentScalarWhereWithAggregatesInput
      | ConsentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Consent'> | string;
    userId?: StringWithAggregatesFilter<'Consent'> | string;
    type?: EnumConsentTypeWithAggregatesFilter<'Consent'> | $Enums.ConsentType;
    granted?: BoolWithAggregatesFilter<'Consent'> | boolean;
    grantedAt?:
      | DateTimeNullableWithAggregatesFilter<'Consent'>
      | Date
      | string
      | null;
    ipAddress?: StringNullableWithAggregatesFilter<'Consent'> | string | null;
    userAgent?: StringNullableWithAggregatesFilter<'Consent'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Consent'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Consent'> | Date | string;
  };

  export type NearbyPlaceWhereInput = {
    AND?: NearbyPlaceWhereInput | NearbyPlaceWhereInput[];
    OR?: NearbyPlaceWhereInput[];
    NOT?: NearbyPlaceWhereInput | NearbyPlaceWhereInput[];
    id?: StringFilter<'NearbyPlace'> | string;
    name?: StringFilter<'NearbyPlace'> | string;
    address?: StringFilter<'NearbyPlace'> | string;
    latitude?: FloatFilter<'NearbyPlace'> | number;
    longitude?: FloatFilter<'NearbyPlace'> | number;
    category?: StringFilter<'NearbyPlace'> | string;
    rating?: FloatNullableFilter<'NearbyPlace'> | number | null;
    website?: StringNullableFilter<'NearbyPlace'> | string | null;
    phone?: StringNullableFilter<'NearbyPlace'> | string | null;
    distance?: FloatNullableFilter<'NearbyPlace'> | number | null;
    eventId?: StringFilter<'NearbyPlace'> | string;
    createdAt?: DateTimeFilter<'NearbyPlace'> | Date | string;
    updatedAt?: DateTimeFilter<'NearbyPlace'> | Date | string;
    event?: XOR<EventRelationFilter, EventWhereInput>;
  };

  export type NearbyPlaceOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    category?: SortOrder;
    rating?: SortOrderInput | SortOrder;
    website?: SortOrderInput | SortOrder;
    phone?: SortOrderInput | SortOrder;
    distance?: SortOrderInput | SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    event?: EventOrderByWithRelationInput;
  };

  export type NearbyPlaceWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: NearbyPlaceWhereInput | NearbyPlaceWhereInput[];
      OR?: NearbyPlaceWhereInput[];
      NOT?: NearbyPlaceWhereInput | NearbyPlaceWhereInput[];
      name?: StringFilter<'NearbyPlace'> | string;
      address?: StringFilter<'NearbyPlace'> | string;
      latitude?: FloatFilter<'NearbyPlace'> | number;
      longitude?: FloatFilter<'NearbyPlace'> | number;
      category?: StringFilter<'NearbyPlace'> | string;
      rating?: FloatNullableFilter<'NearbyPlace'> | number | null;
      website?: StringNullableFilter<'NearbyPlace'> | string | null;
      phone?: StringNullableFilter<'NearbyPlace'> | string | null;
      distance?: FloatNullableFilter<'NearbyPlace'> | number | null;
      eventId?: StringFilter<'NearbyPlace'> | string;
      createdAt?: DateTimeFilter<'NearbyPlace'> | Date | string;
      updatedAt?: DateTimeFilter<'NearbyPlace'> | Date | string;
      event?: XOR<EventRelationFilter, EventWhereInput>;
    },
    'id'
  >;

  export type NearbyPlaceOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    category?: SortOrder;
    rating?: SortOrderInput | SortOrder;
    website?: SortOrderInput | SortOrder;
    phone?: SortOrderInput | SortOrder;
    distance?: SortOrderInput | SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: NearbyPlaceCountOrderByAggregateInput;
    _avg?: NearbyPlaceAvgOrderByAggregateInput;
    _max?: NearbyPlaceMaxOrderByAggregateInput;
    _min?: NearbyPlaceMinOrderByAggregateInput;
    _sum?: NearbyPlaceSumOrderByAggregateInput;
  };

  export type NearbyPlaceScalarWhereWithAggregatesInput = {
    AND?:
      | NearbyPlaceScalarWhereWithAggregatesInput
      | NearbyPlaceScalarWhereWithAggregatesInput[];
    OR?: NearbyPlaceScalarWhereWithAggregatesInput[];
    NOT?:
      | NearbyPlaceScalarWhereWithAggregatesInput
      | NearbyPlaceScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'NearbyPlace'> | string;
    name?: StringWithAggregatesFilter<'NearbyPlace'> | string;
    address?: StringWithAggregatesFilter<'NearbyPlace'> | string;
    latitude?: FloatWithAggregatesFilter<'NearbyPlace'> | number;
    longitude?: FloatWithAggregatesFilter<'NearbyPlace'> | number;
    category?: StringWithAggregatesFilter<'NearbyPlace'> | string;
    rating?: FloatNullableWithAggregatesFilter<'NearbyPlace'> | number | null;
    website?: StringNullableWithAggregatesFilter<'NearbyPlace'> | string | null;
    phone?: StringNullableWithAggregatesFilter<'NearbyPlace'> | string | null;
    distance?: FloatNullableWithAggregatesFilter<'NearbyPlace'> | number | null;
    eventId?: StringWithAggregatesFilter<'NearbyPlace'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'NearbyPlace'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'NearbyPlace'> | Date | string;
  };

  export type InvitationWhereInput = {
    AND?: InvitationWhereInput | InvitationWhereInput[];
    OR?: InvitationWhereInput[];
    NOT?: InvitationWhereInput | InvitationWhereInput[];
    id?: StringFilter<'Invitation'> | string;
    email?: StringFilter<'Invitation'> | string;
    role?: EnumUserRoleFilter<'Invitation'> | $Enums.UserRole;
    token?: StringFilter<'Invitation'> | string;
    expiresAt?: DateTimeFilter<'Invitation'> | Date | string;
    acceptedAt?: DateTimeNullableFilter<'Invitation'> | Date | string | null;
    invitedBy?: StringFilter<'Invitation'> | string;
    createdAt?: DateTimeFilter<'Invitation'> | Date | string;
    inviter?: XOR<UserRelationFilter, UserWhereInput>;
    invitee?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
  };

  export type InvitationOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    role?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    acceptedAt?: SortOrderInput | SortOrder;
    invitedBy?: SortOrder;
    createdAt?: SortOrder;
    inviter?: UserOrderByWithRelationInput;
    invitee?: UserOrderByWithRelationInput;
  };

  export type InvitationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      token?: string;
      AND?: InvitationWhereInput | InvitationWhereInput[];
      OR?: InvitationWhereInput[];
      NOT?: InvitationWhereInput | InvitationWhereInput[];
      email?: StringFilter<'Invitation'> | string;
      role?: EnumUserRoleFilter<'Invitation'> | $Enums.UserRole;
      expiresAt?: DateTimeFilter<'Invitation'> | Date | string;
      acceptedAt?: DateTimeNullableFilter<'Invitation'> | Date | string | null;
      invitedBy?: StringFilter<'Invitation'> | string;
      createdAt?: DateTimeFilter<'Invitation'> | Date | string;
      inviter?: XOR<UserRelationFilter, UserWhereInput>;
      invitee?: XOR<UserNullableRelationFilter, UserWhereInput> | null;
    },
    'id' | 'token'
  >;

  export type InvitationOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    role?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    acceptedAt?: SortOrderInput | SortOrder;
    invitedBy?: SortOrder;
    createdAt?: SortOrder;
    _count?: InvitationCountOrderByAggregateInput;
    _max?: InvitationMaxOrderByAggregateInput;
    _min?: InvitationMinOrderByAggregateInput;
  };

  export type InvitationScalarWhereWithAggregatesInput = {
    AND?:
      | InvitationScalarWhereWithAggregatesInput
      | InvitationScalarWhereWithAggregatesInput[];
    OR?: InvitationScalarWhereWithAggregatesInput[];
    NOT?:
      | InvitationScalarWhereWithAggregatesInput
      | InvitationScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Invitation'> | string;
    email?: StringWithAggregatesFilter<'Invitation'> | string;
    role?: EnumUserRoleWithAggregatesFilter<'Invitation'> | $Enums.UserRole;
    token?: StringWithAggregatesFilter<'Invitation'> | string;
    expiresAt?: DateTimeWithAggregatesFilter<'Invitation'> | Date | string;
    acceptedAt?:
      | DateTimeNullableWithAggregatesFilter<'Invitation'>
      | Date
      | string
      | null;
    invitedBy?: StringWithAggregatesFilter<'Invitation'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Invitation'> | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type EventCreateInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: UserCreateNestedOneWithoutOwnedEventsInput;
    venue?: VenueCreateNestedOneWithoutEventsInput;
    category?: CategoryCreateNestedOneWithoutEventsInput;
    waitlist?: WaitlistEntryCreateNestedManyWithoutEventInput;
    shows?: ShowCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlist?: WaitlistEntryUncheckedCreateNestedManyWithoutEventInput;
    shows?: ShowUncheckedCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    owner?: UserUpdateOneRequiredWithoutOwnedEventsNestedInput;
    venue?: VenueUpdateOneWithoutEventsNestedInput;
    category?: CategoryUpdateOneWithoutEventsNestedInput;
    waitlist?: WaitlistEntryUpdateManyWithoutEventNestedInput;
    shows?: ShowUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlist?: WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput;
    shows?: ShowUncheckedUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventCreateManyInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type VenueCreateInput = {
    id?: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    website?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    events?: EventCreateNestedManyWithoutVenueInput;
  };

  export type VenueUncheckedCreateInput = {
    id?: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    website?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    events?: EventUncheckedCreateNestedManyWithoutVenueInput;
  };

  export type VenueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    city?: StringFieldUpdateOperationsInput | string;
    country?: StringFieldUpdateOperationsInput | string;
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    events?: EventUpdateManyWithoutVenueNestedInput;
  };

  export type VenueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    city?: StringFieldUpdateOperationsInput | string;
    country?: StringFieldUpdateOperationsInput | string;
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    events?: EventUncheckedUpdateManyWithoutVenueNestedInput;
  };

  export type VenueCreateManyInput = {
    id?: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    website?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type VenueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    city?: StringFieldUpdateOperationsInput | string;
    country?: StringFieldUpdateOperationsInput | string;
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type VenueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    city?: StringFieldUpdateOperationsInput | string;
    country?: StringFieldUpdateOperationsInput | string;
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryCreateInput = {
    id?: string;
    email: string;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    event: EventCreateNestedOneWithoutWaitlistInput;
    user?: UserCreateNestedOneWithoutWaitlistEntriesInput;
  };

  export type WaitlistEntryUncheckedCreateInput = {
    id?: string;
    email: string;
    eventId: string;
    userId?: string | null;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type WaitlistEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    event?: EventUpdateOneRequiredWithoutWaitlistNestedInput;
    user?: UserUpdateOneWithoutWaitlistEntriesNestedInput;
  };

  export type WaitlistEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryCreateManyInput = {
    id?: string;
    email: string;
    eventId: string;
    userId?: string | null;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type WaitlistEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SessionCreateInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    user: UserCreateNestedOneWithoutSessionsInput;
  };

  export type SessionUncheckedCreateInput = {
    id?: string;
    userId: string;
    token: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput;
  };

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SessionCreateManyInput = {
    id?: string;
    userId: string;
    token: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AuditLogCreateInput = {
    id?: string;
    action: string;
    resource: string;
    resourceId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    user?: UserCreateNestedOneWithoutAuditLogsInput;
  };

  export type AuditLogUncheckedCreateInput = {
    id?: string;
    action: string;
    resource: string;
    resourceId: string;
    userId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneWithoutAuditLogsNestedInput;
  };

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogCreateManyInput = {
    id?: string;
    action: string;
    resource: string;
    resourceId: string;
    userId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ShowCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    event: EventCreateNestedOneWithoutShowsInput;
  };

  export type ShowUncheckedCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    eventId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type ShowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    event?: EventUpdateOneRequiredWithoutShowsNestedInput;
  };

  export type ShowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    eventId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ShowCreateManyInput = {
    id?: string;
    title: string;
    description?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    eventId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type ShowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ShowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    eventId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type CategoryCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    events?: EventCreateNestedManyWithoutCategoryInput;
  };

  export type CategoryUncheckedCreateInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    events?: EventUncheckedCreateNestedManyWithoutCategoryInput;
  };

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    events?: EventUpdateManyWithoutCategoryNestedInput;
  };

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    events?: EventUncheckedUpdateManyWithoutCategoryNestedInput;
  };

  export type CategoryCreateManyInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type EmailVerificationCreateInput = {
    id?: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date | string;
    verifiedAt?: Date | string | null;
    createdAt?: Date | string;
    user?: UserCreateNestedOneWithoutEmailVerificationsInput;
  };

  export type EmailVerificationUncheckedCreateInput = {
    id?: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date | string;
    verifiedAt?: Date | string | null;
    userId?: string | null;
    createdAt?: Date | string;
  };

  export type EmailVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneWithoutEmailVerificationsNestedInput;
  };

  export type EmailVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EmailVerificationCreateManyInput = {
    id?: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date | string;
    verifiedAt?: Date | string | null;
    userId?: string | null;
    createdAt?: Date | string;
  };

  export type EmailVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EmailVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ConsentCreateInput = {
    id?: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt?: Date | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: UserCreateNestedOneWithoutConsentsInput;
  };

  export type ConsentUncheckedCreateInput = {
    id?: string;
    userId: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt?: Date | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ConsentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    user?: UserUpdateOneRequiredWithoutConsentsNestedInput;
  };

  export type ConsentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ConsentCreateManyInput = {
    id?: string;
    userId: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt?: Date | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ConsentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ConsentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NearbyPlaceCreateInput = {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating?: number | null;
    website?: string | null;
    phone?: string | null;
    distance?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    event: EventCreateNestedOneWithoutNearbyPlacesInput;
  };

  export type NearbyPlaceUncheckedCreateInput = {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating?: number | null;
    website?: string | null;
    phone?: string | null;
    distance?: number | null;
    eventId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type NearbyPlaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    event?: EventUpdateOneRequiredWithoutNearbyPlacesNestedInput;
  };

  export type NearbyPlaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    eventId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NearbyPlaceCreateManyInput = {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating?: number | null;
    website?: string | null;
    phone?: string | null;
    distance?: number | null;
    eventId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type NearbyPlaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NearbyPlaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    eventId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationCreateInput = {
    id?: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    inviter: UserCreateNestedOneWithoutInvitationsSentInput;
    invitee?: UserCreateNestedOneWithoutInvitationsReceivedInput;
  };

  export type InvitationUncheckedCreateInput = {
    id?: string;
    email: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    invitedBy: string;
    createdAt?: Date | string;
  };

  export type InvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inviter?: UserUpdateOneRequiredWithoutInvitationsSentNestedInput;
    invitee?: UserUpdateOneWithoutInvitationsReceivedNestedInput;
  };

  export type InvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    invitedBy?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationCreateManyInput = {
    id?: string;
    email: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    invitedBy: string;
    createdAt?: Date | string;
  };

  export type InvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    invitedBy?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type EventListRelationFilter = {
    every?: EventWhereInput;
    some?: EventWhereInput;
    none?: EventWhereInput;
  };

  export type WaitlistEntryListRelationFilter = {
    every?: WaitlistEntryWhereInput;
    some?: WaitlistEntryWhereInput;
    none?: WaitlistEntryWhereInput;
  };

  export type SessionListRelationFilter = {
    every?: SessionWhereInput;
    some?: SessionWhereInput;
    none?: SessionWhereInput;
  };

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput;
    some?: AuditLogWhereInput;
    none?: AuditLogWhereInput;
  };

  export type EmailVerificationListRelationFilter = {
    every?: EmailVerificationWhereInput;
    some?: EmailVerificationWhereInput;
    none?: EmailVerificationWhereInput;
  };

  export type ConsentListRelationFilter = {
    every?: ConsentWhereInput;
    some?: ConsentWhereInput;
    none?: ConsentWhereInput;
  };

  export type InvitationListRelationFilter = {
    every?: InvitationWhereInput;
    some?: InvitationWhereInput;
    none?: InvitationWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type WaitlistEntryOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type EmailVerificationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ConsentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type InvitationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    name?: SortOrder;
    role?: SortOrder;
    isActive?: SortOrder;
    lastLoginAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    name?: SortOrder;
    role?: SortOrder;
    isActive?: SortOrder;
    lastLoginAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    name?: SortOrder;
    role?: SortOrder;
    isActive?: SortOrder;
    lastLoginAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumUserRoleWithAggregatesFilter<$PrismaModel>
      | $Enums.UserRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: NestedEnumUserRoleFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type EnumEventStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EventStatus[]
      | ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type UserRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type VenueNullableRelationFilter = {
    is?: VenueWhereInput | null;
    isNot?: VenueWhereInput | null;
  };

  export type CategoryNullableRelationFilter = {
    is?: CategoryWhereInput | null;
    isNot?: CategoryWhereInput | null;
  };

  export type ShowListRelationFilter = {
    every?: ShowWhereInput;
    some?: ShowWhereInput;
    none?: ShowWhereInput;
  };

  export type NearbyPlaceListRelationFilter = {
    every?: NearbyPlaceWhereInput;
    some?: NearbyPlaceWhereInput;
    none?: NearbyPlaceWhereInput;
  };

  export type ShowOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type NearbyPlaceOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    shortDescription?: SortOrder;
    status?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrder;
    mapLat?: SortOrder;
    mapLng?: SortOrder;
    mapZoom?: SortOrder;
    mapAddress?: SortOrder;
    ownerId?: SortOrder;
    venueId?: SortOrder;
    categoryId?: SortOrder;
    isPublic?: SortOrder;
    featured?: SortOrder;
    tags?: SortOrder;
    metadata?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type EventAvgOrderByAggregateInput = {
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    mapLat?: SortOrder;
    mapLng?: SortOrder;
    mapZoom?: SortOrder;
  };

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    shortDescription?: SortOrder;
    status?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrder;
    mapLat?: SortOrder;
    mapLng?: SortOrder;
    mapZoom?: SortOrder;
    mapAddress?: SortOrder;
    ownerId?: SortOrder;
    venueId?: SortOrder;
    categoryId?: SortOrder;
    isPublic?: SortOrder;
    featured?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    shortDescription?: SortOrder;
    status?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrder;
    mapLat?: SortOrder;
    mapLng?: SortOrder;
    mapZoom?: SortOrder;
    mapAddress?: SortOrder;
    ownerId?: SortOrder;
    venueId?: SortOrder;
    categoryId?: SortOrder;
    isPublic?: SortOrder;
    featured?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type EventSumOrderByAggregateInput = {
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    mapLat?: SortOrder;
    mapLng?: SortOrder;
    mapZoom?: SortOrder;
  };

  export type EnumEventStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EventStatus[]
      | ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumEventStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.EventStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumEventStatusFilter<$PrismaModel>;
    _max?: NestedEnumEventStatusFilter<$PrismaModel>;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          'path'
        >
      >;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
  };

  export type VenueCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    city?: SortOrder;
    country?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    website?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type VenueAvgOrderByAggregateInput = {
    latitude?: SortOrder;
    longitude?: SortOrder;
  };

  export type VenueMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    city?: SortOrder;
    country?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    website?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type VenueMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    city?: SortOrder;
    country?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    website?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type VenueSumOrderByAggregateInput = {
    latitude?: SortOrder;
    longitude?: SortOrder;
  };

  export type EnumWaitlistStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.WaitlistStatus
      | EnumWaitlistStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumWaitlistStatusFilter<$PrismaModel> | $Enums.WaitlistStatus;
  };

  export type EventRelationFilter = {
    is?: EventWhereInput;
    isNot?: EventWhereInput;
  };

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null;
    isNot?: UserWhereInput | null;
  };

  export type WaitlistEntryEmailEventIdCompoundUniqueInput = {
    email: string;
    eventId: string;
  };

  export type WaitlistEntryCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    eventId?: SortOrder;
    userId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type WaitlistEntryMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    eventId?: SortOrder;
    userId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type WaitlistEntryMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    eventId?: SortOrder;
    userId?: SortOrder;
    status?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type EnumWaitlistStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.WaitlistStatus
      | EnumWaitlistStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumWaitlistStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.WaitlistStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumWaitlistStatusFilter<$PrismaModel>;
    _max?: NestedEnumWaitlistStatusFilter<$PrismaModel>;
  };

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder;
    action?: SortOrder;
    resource?: SortOrder;
    resourceId?: SortOrder;
    userId?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    metadata?: SortOrder;
    createdAt?: SortOrder;
  };

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder;
    action?: SortOrder;
    resource?: SortOrder;
    resourceId?: SortOrder;
    userId?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
  };

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder;
    action?: SortOrder;
    resource?: SortOrder;
    resourceId?: SortOrder;
    userId?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
  };

  export type ShowCountOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type ShowAvgOrderByAggregateInput = {
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
  };

  export type ShowMaxOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type ShowMinOrderByAggregateInput = {
    id?: SortOrder;
    title?: SortOrder;
    description?: SortOrder;
    startDate?: SortOrder;
    endDate?: SortOrder;
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
    youtubeUrl?: SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type ShowSumOrderByAggregateInput = {
    capacity?: SortOrder;
    currentWaitlist?: SortOrder;
  };

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    slug?: SortOrder;
    description?: SortOrder;
    color?: SortOrder;
    icon?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type EnumEmailVerificationTypeFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.EmailVerificationType
      | EnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumEmailVerificationTypeFilter<$PrismaModel>
      | $Enums.EmailVerificationType;
  };

  export type EmailVerificationCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    token?: SortOrder;
    type?: SortOrder;
    expiresAt?: SortOrder;
    verifiedAt?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EmailVerificationMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    token?: SortOrder;
    type?: SortOrder;
    expiresAt?: SortOrder;
    verifiedAt?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EmailVerificationMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    token?: SortOrder;
    type?: SortOrder;
    expiresAt?: SortOrder;
    verifiedAt?: SortOrder;
    userId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumEmailVerificationTypeWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.EmailVerificationType
      | EnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumEmailVerificationTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.EmailVerificationType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumEmailVerificationTypeFilter<$PrismaModel>;
    _max?: NestedEnumEmailVerificationTypeFilter<$PrismaModel>;
  };

  export type EnumConsentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ConsentType[]
      | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumConsentTypeFilter<$PrismaModel> | $Enums.ConsentType;
  };

  export type ConsentUserIdTypeCompoundUniqueInput = {
    userId: string;
    type: $Enums.ConsentType;
  };

  export type ConsentCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    type?: SortOrder;
    granted?: SortOrder;
    grantedAt?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ConsentMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    type?: SortOrder;
    granted?: SortOrder;
    grantedAt?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type ConsentMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    type?: SortOrder;
    granted?: SortOrder;
    grantedAt?: SortOrder;
    ipAddress?: SortOrder;
    userAgent?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumConsentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ConsentType[]
      | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumConsentTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.ConsentType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumConsentTypeFilter<$PrismaModel>;
    _max?: NestedEnumConsentTypeFilter<$PrismaModel>;
  };

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NearbyPlaceCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    website?: SortOrder;
    phone?: SortOrder;
    distance?: SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type NearbyPlaceAvgOrderByAggregateInput = {
    latitude?: SortOrder;
    longitude?: SortOrder;
    rating?: SortOrder;
    distance?: SortOrder;
  };

  export type NearbyPlaceMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    website?: SortOrder;
    phone?: SortOrder;
    distance?: SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type NearbyPlaceMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    latitude?: SortOrder;
    longitude?: SortOrder;
    category?: SortOrder;
    rating?: SortOrder;
    website?: SortOrder;
    phone?: SortOrder;
    distance?: SortOrder;
    eventId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type NearbyPlaceSumOrderByAggregateInput = {
    latitude?: SortOrder;
    longitude?: SortOrder;
    rating?: SortOrder;
    distance?: SortOrder;
  };

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type InvitationCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    role?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    acceptedAt?: SortOrder;
    invitedBy?: SortOrder;
    createdAt?: SortOrder;
  };

  export type InvitationMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    role?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    acceptedAt?: SortOrder;
    invitedBy?: SortOrder;
    createdAt?: SortOrder;
  };

  export type InvitationMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    role?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    acceptedAt?: SortOrder;
    invitedBy?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EventCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<EventCreateWithoutOwnerInput, EventUncheckedCreateWithoutOwnerInput>
      | EventCreateWithoutOwnerInput[]
      | EventUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutOwnerInput
      | EventCreateOrConnectWithoutOwnerInput[];
    createMany?: EventCreateManyOwnerInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type WaitlistEntryCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutUserInput,
          WaitlistEntryUncheckedCreateWithoutUserInput
        >
      | WaitlistEntryCreateWithoutUserInput[]
      | WaitlistEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutUserInput
      | WaitlistEntryCreateOrConnectWithoutUserInput[];
    createMany?: WaitlistEntryCreateManyUserInputEnvelope;
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
  };

  export type SessionCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
  };

  export type EmailVerificationCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          EmailVerificationCreateWithoutUserInput,
          EmailVerificationUncheckedCreateWithoutUserInput
        >
      | EmailVerificationCreateWithoutUserInput[]
      | EmailVerificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EmailVerificationCreateOrConnectWithoutUserInput
      | EmailVerificationCreateOrConnectWithoutUserInput[];
    createMany?: EmailVerificationCreateManyUserInputEnvelope;
    connect?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
  };

  export type ConsentCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ConsentCreateWithoutUserInput,
          ConsentUncheckedCreateWithoutUserInput
        >
      | ConsentCreateWithoutUserInput[]
      | ConsentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ConsentCreateOrConnectWithoutUserInput
      | ConsentCreateOrConnectWithoutUserInput[];
    createMany?: ConsentCreateManyUserInputEnvelope;
    connect?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
  };

  export type InvitationCreateNestedManyWithoutInviterInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviterInput,
          InvitationUncheckedCreateWithoutInviterInput
        >
      | InvitationCreateWithoutInviterInput[]
      | InvitationUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviterInput
      | InvitationCreateOrConnectWithoutInviterInput[];
    createMany?: InvitationCreateManyInviterInputEnvelope;
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
  };

  export type InvitationCreateNestedManyWithoutInviteeInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviteeInput,
          InvitationUncheckedCreateWithoutInviteeInput
        >
      | InvitationCreateWithoutInviteeInput[]
      | InvitationUncheckedCreateWithoutInviteeInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviteeInput
      | InvitationCreateOrConnectWithoutInviteeInput[];
    createMany?: InvitationCreateManyInviteeInputEnvelope;
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
  };

  export type EventUncheckedCreateNestedManyWithoutOwnerInput = {
    create?:
      | XOR<EventCreateWithoutOwnerInput, EventUncheckedCreateWithoutOwnerInput>
      | EventCreateWithoutOwnerInput[]
      | EventUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutOwnerInput
      | EventCreateOrConnectWithoutOwnerInput[];
    createMany?: EventCreateManyOwnerInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type WaitlistEntryUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutUserInput,
          WaitlistEntryUncheckedCreateWithoutUserInput
        >
      | WaitlistEntryCreateWithoutUserInput[]
      | WaitlistEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutUserInput
      | WaitlistEntryCreateOrConnectWithoutUserInput[];
    createMany?: WaitlistEntryCreateManyUserInputEnvelope;
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
  };

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
  };

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
  };

  export type EmailVerificationUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          EmailVerificationCreateWithoutUserInput,
          EmailVerificationUncheckedCreateWithoutUserInput
        >
      | EmailVerificationCreateWithoutUserInput[]
      | EmailVerificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EmailVerificationCreateOrConnectWithoutUserInput
      | EmailVerificationCreateOrConnectWithoutUserInput[];
    createMany?: EmailVerificationCreateManyUserInputEnvelope;
    connect?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
  };

  export type ConsentUncheckedCreateNestedManyWithoutUserInput = {
    create?:
      | XOR<
          ConsentCreateWithoutUserInput,
          ConsentUncheckedCreateWithoutUserInput
        >
      | ConsentCreateWithoutUserInput[]
      | ConsentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ConsentCreateOrConnectWithoutUserInput
      | ConsentCreateOrConnectWithoutUserInput[];
    createMany?: ConsentCreateManyUserInputEnvelope;
    connect?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
  };

  export type InvitationUncheckedCreateNestedManyWithoutInviterInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviterInput,
          InvitationUncheckedCreateWithoutInviterInput
        >
      | InvitationCreateWithoutInviterInput[]
      | InvitationUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviterInput
      | InvitationCreateOrConnectWithoutInviterInput[];
    createMany?: InvitationCreateManyInviterInputEnvelope;
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
  };

  export type InvitationUncheckedCreateNestedManyWithoutInviteeInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviteeInput,
          InvitationUncheckedCreateWithoutInviteeInput
        >
      | InvitationCreateWithoutInviteeInput[]
      | InvitationUncheckedCreateWithoutInviteeInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviteeInput
      | InvitationCreateOrConnectWithoutInviteeInput[];
    createMany?: InvitationCreateManyInviteeInputEnvelope;
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type EventUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<EventCreateWithoutOwnerInput, EventUncheckedCreateWithoutOwnerInput>
      | EventCreateWithoutOwnerInput[]
      | EventUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutOwnerInput
      | EventCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutOwnerInput
      | EventUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: EventCreateManyOwnerInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutOwnerInput
      | EventUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutOwnerInput
      | EventUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type WaitlistEntryUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutUserInput,
          WaitlistEntryUncheckedCreateWithoutUserInput
        >
      | WaitlistEntryCreateWithoutUserInput[]
      | WaitlistEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutUserInput
      | WaitlistEntryCreateOrConnectWithoutUserInput[];
    upsert?:
      | WaitlistEntryUpsertWithWhereUniqueWithoutUserInput
      | WaitlistEntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: WaitlistEntryCreateManyUserInputEnvelope;
    set?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    disconnect?:
      | WaitlistEntryWhereUniqueInput
      | WaitlistEntryWhereUniqueInput[];
    delete?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    update?:
      | WaitlistEntryUpdateWithWhereUniqueWithoutUserInput
      | WaitlistEntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | WaitlistEntryUpdateManyWithWhereWithoutUserInput
      | WaitlistEntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | WaitlistEntryScalarWhereInput
      | WaitlistEntryScalarWhereInput[];
  };

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    upsert?:
      | AuditLogUpsertWithWhereUniqueWithoutUserInput
      | AuditLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    update?:
      | AuditLogUpdateWithWhereUniqueWithoutUserInput
      | AuditLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AuditLogUpdateManyWithWhereWithoutUserInput
      | AuditLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
  };

  export type EmailVerificationUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          EmailVerificationCreateWithoutUserInput,
          EmailVerificationUncheckedCreateWithoutUserInput
        >
      | EmailVerificationCreateWithoutUserInput[]
      | EmailVerificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EmailVerificationCreateOrConnectWithoutUserInput
      | EmailVerificationCreateOrConnectWithoutUserInput[];
    upsert?:
      | EmailVerificationUpsertWithWhereUniqueWithoutUserInput
      | EmailVerificationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: EmailVerificationCreateManyUserInputEnvelope;
    set?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    disconnect?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    delete?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    connect?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    update?:
      | EmailVerificationUpdateWithWhereUniqueWithoutUserInput
      | EmailVerificationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | EmailVerificationUpdateManyWithWhereWithoutUserInput
      | EmailVerificationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | EmailVerificationScalarWhereInput
      | EmailVerificationScalarWhereInput[];
  };

  export type ConsentUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ConsentCreateWithoutUserInput,
          ConsentUncheckedCreateWithoutUserInput
        >
      | ConsentCreateWithoutUserInput[]
      | ConsentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ConsentCreateOrConnectWithoutUserInput
      | ConsentCreateOrConnectWithoutUserInput[];
    upsert?:
      | ConsentUpsertWithWhereUniqueWithoutUserInput
      | ConsentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ConsentCreateManyUserInputEnvelope;
    set?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    disconnect?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    delete?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    connect?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    update?:
      | ConsentUpdateWithWhereUniqueWithoutUserInput
      | ConsentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ConsentUpdateManyWithWhereWithoutUserInput
      | ConsentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ConsentScalarWhereInput | ConsentScalarWhereInput[];
  };

  export type InvitationUpdateManyWithoutInviterNestedInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviterInput,
          InvitationUncheckedCreateWithoutInviterInput
        >
      | InvitationCreateWithoutInviterInput[]
      | InvitationUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviterInput
      | InvitationCreateOrConnectWithoutInviterInput[];
    upsert?:
      | InvitationUpsertWithWhereUniqueWithoutInviterInput
      | InvitationUpsertWithWhereUniqueWithoutInviterInput[];
    createMany?: InvitationCreateManyInviterInputEnvelope;
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    update?:
      | InvitationUpdateWithWhereUniqueWithoutInviterInput
      | InvitationUpdateWithWhereUniqueWithoutInviterInput[];
    updateMany?:
      | InvitationUpdateManyWithWhereWithoutInviterInput
      | InvitationUpdateManyWithWhereWithoutInviterInput[];
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[];
  };

  export type InvitationUpdateManyWithoutInviteeNestedInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviteeInput,
          InvitationUncheckedCreateWithoutInviteeInput
        >
      | InvitationCreateWithoutInviteeInput[]
      | InvitationUncheckedCreateWithoutInviteeInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviteeInput
      | InvitationCreateOrConnectWithoutInviteeInput[];
    upsert?:
      | InvitationUpsertWithWhereUniqueWithoutInviteeInput
      | InvitationUpsertWithWhereUniqueWithoutInviteeInput[];
    createMany?: InvitationCreateManyInviteeInputEnvelope;
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    update?:
      | InvitationUpdateWithWhereUniqueWithoutInviteeInput
      | InvitationUpdateWithWhereUniqueWithoutInviteeInput[];
    updateMany?:
      | InvitationUpdateManyWithWhereWithoutInviteeInput
      | InvitationUpdateManyWithWhereWithoutInviteeInput[];
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[];
  };

  export type EventUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?:
      | XOR<EventCreateWithoutOwnerInput, EventUncheckedCreateWithoutOwnerInput>
      | EventCreateWithoutOwnerInput[]
      | EventUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutOwnerInput
      | EventCreateOrConnectWithoutOwnerInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutOwnerInput
      | EventUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: EventCreateManyOwnerInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutOwnerInput
      | EventUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutOwnerInput
      | EventUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutUserInput,
          WaitlistEntryUncheckedCreateWithoutUserInput
        >
      | WaitlistEntryCreateWithoutUserInput[]
      | WaitlistEntryUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutUserInput
      | WaitlistEntryCreateOrConnectWithoutUserInput[];
    upsert?:
      | WaitlistEntryUpsertWithWhereUniqueWithoutUserInput
      | WaitlistEntryUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: WaitlistEntryCreateManyUserInputEnvelope;
    set?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    disconnect?:
      | WaitlistEntryWhereUniqueInput
      | WaitlistEntryWhereUniqueInput[];
    delete?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    update?:
      | WaitlistEntryUpdateWithWhereUniqueWithoutUserInput
      | WaitlistEntryUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | WaitlistEntryUpdateManyWithWhereWithoutUserInput
      | WaitlistEntryUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | WaitlistEntryScalarWhereInput
      | WaitlistEntryScalarWhereInput[];
  };

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          SessionCreateWithoutUserInput,
          SessionUncheckedCreateWithoutUserInput
        >
      | SessionCreateWithoutUserInput[]
      | SessionUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | SessionCreateOrConnectWithoutUserInput
      | SessionCreateOrConnectWithoutUserInput[];
    upsert?:
      | SessionUpsertWithWhereUniqueWithoutUserInput
      | SessionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: SessionCreateManyUserInputEnvelope;
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[];
    update?:
      | SessionUpdateWithWhereUniqueWithoutUserInput
      | SessionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | SessionUpdateManyWithWhereWithoutUserInput
      | SessionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[];
  };

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          AuditLogCreateWithoutUserInput,
          AuditLogUncheckedCreateWithoutUserInput
        >
      | AuditLogCreateWithoutUserInput[]
      | AuditLogUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | AuditLogCreateOrConnectWithoutUserInput
      | AuditLogCreateOrConnectWithoutUserInput[];
    upsert?:
      | AuditLogUpsertWithWhereUniqueWithoutUserInput
      | AuditLogUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: AuditLogCreateManyUserInputEnvelope;
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[];
    update?:
      | AuditLogUpdateWithWhereUniqueWithoutUserInput
      | AuditLogUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | AuditLogUpdateManyWithWhereWithoutUserInput
      | AuditLogUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
  };

  export type EmailVerificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          EmailVerificationCreateWithoutUserInput,
          EmailVerificationUncheckedCreateWithoutUserInput
        >
      | EmailVerificationCreateWithoutUserInput[]
      | EmailVerificationUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | EmailVerificationCreateOrConnectWithoutUserInput
      | EmailVerificationCreateOrConnectWithoutUserInput[];
    upsert?:
      | EmailVerificationUpsertWithWhereUniqueWithoutUserInput
      | EmailVerificationUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: EmailVerificationCreateManyUserInputEnvelope;
    set?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    disconnect?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    delete?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    connect?:
      | EmailVerificationWhereUniqueInput
      | EmailVerificationWhereUniqueInput[];
    update?:
      | EmailVerificationUpdateWithWhereUniqueWithoutUserInput
      | EmailVerificationUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | EmailVerificationUpdateManyWithWhereWithoutUserInput
      | EmailVerificationUpdateManyWithWhereWithoutUserInput[];
    deleteMany?:
      | EmailVerificationScalarWhereInput
      | EmailVerificationScalarWhereInput[];
  };

  export type ConsentUncheckedUpdateManyWithoutUserNestedInput = {
    create?:
      | XOR<
          ConsentCreateWithoutUserInput,
          ConsentUncheckedCreateWithoutUserInput
        >
      | ConsentCreateWithoutUserInput[]
      | ConsentUncheckedCreateWithoutUserInput[];
    connectOrCreate?:
      | ConsentCreateOrConnectWithoutUserInput
      | ConsentCreateOrConnectWithoutUserInput[];
    upsert?:
      | ConsentUpsertWithWhereUniqueWithoutUserInput
      | ConsentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: ConsentCreateManyUserInputEnvelope;
    set?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    disconnect?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    delete?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    connect?: ConsentWhereUniqueInput | ConsentWhereUniqueInput[];
    update?:
      | ConsentUpdateWithWhereUniqueWithoutUserInput
      | ConsentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?:
      | ConsentUpdateManyWithWhereWithoutUserInput
      | ConsentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: ConsentScalarWhereInput | ConsentScalarWhereInput[];
  };

  export type InvitationUncheckedUpdateManyWithoutInviterNestedInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviterInput,
          InvitationUncheckedCreateWithoutInviterInput
        >
      | InvitationCreateWithoutInviterInput[]
      | InvitationUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviterInput
      | InvitationCreateOrConnectWithoutInviterInput[];
    upsert?:
      | InvitationUpsertWithWhereUniqueWithoutInviterInput
      | InvitationUpsertWithWhereUniqueWithoutInviterInput[];
    createMany?: InvitationCreateManyInviterInputEnvelope;
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    update?:
      | InvitationUpdateWithWhereUniqueWithoutInviterInput
      | InvitationUpdateWithWhereUniqueWithoutInviterInput[];
    updateMany?:
      | InvitationUpdateManyWithWhereWithoutInviterInput
      | InvitationUpdateManyWithWhereWithoutInviterInput[];
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[];
  };

  export type InvitationUncheckedUpdateManyWithoutInviteeNestedInput = {
    create?:
      | XOR<
          InvitationCreateWithoutInviteeInput,
          InvitationUncheckedCreateWithoutInviteeInput
        >
      | InvitationCreateWithoutInviteeInput[]
      | InvitationUncheckedCreateWithoutInviteeInput[];
    connectOrCreate?:
      | InvitationCreateOrConnectWithoutInviteeInput
      | InvitationCreateOrConnectWithoutInviteeInput[];
    upsert?:
      | InvitationUpsertWithWhereUniqueWithoutInviteeInput
      | InvitationUpsertWithWhereUniqueWithoutInviteeInput[];
    createMany?: InvitationCreateManyInviteeInputEnvelope;
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[];
    update?:
      | InvitationUpdateWithWhereUniqueWithoutInviteeInput
      | InvitationUpdateWithWhereUniqueWithoutInviteeInput[];
    updateMany?:
      | InvitationUpdateManyWithWhereWithoutInviteeInput
      | InvitationUpdateManyWithWhereWithoutInviteeInput[];
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[];
  };

  export type EventCreatetagsInput = {
    set: string[];
  };

  export type UserCreateNestedOneWithoutOwnedEventsInput = {
    create?: XOR<
      UserCreateWithoutOwnedEventsInput,
      UserUncheckedCreateWithoutOwnedEventsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedEventsInput;
    connect?: UserWhereUniqueInput;
  };

  export type VenueCreateNestedOneWithoutEventsInput = {
    create?: XOR<
      VenueCreateWithoutEventsInput,
      VenueUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: VenueCreateOrConnectWithoutEventsInput;
    connect?: VenueWhereUniqueInput;
  };

  export type CategoryCreateNestedOneWithoutEventsInput = {
    create?: XOR<
      CategoryCreateWithoutEventsInput,
      CategoryUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: CategoryCreateOrConnectWithoutEventsInput;
    connect?: CategoryWhereUniqueInput;
  };

  export type WaitlistEntryCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutEventInput,
          WaitlistEntryUncheckedCreateWithoutEventInput
        >
      | WaitlistEntryCreateWithoutEventInput[]
      | WaitlistEntryUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutEventInput
      | WaitlistEntryCreateOrConnectWithoutEventInput[];
    createMany?: WaitlistEntryCreateManyEventInputEnvelope;
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
  };

  export type ShowCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<ShowCreateWithoutEventInput, ShowUncheckedCreateWithoutEventInput>
      | ShowCreateWithoutEventInput[]
      | ShowUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | ShowCreateOrConnectWithoutEventInput
      | ShowCreateOrConnectWithoutEventInput[];
    createMany?: ShowCreateManyEventInputEnvelope;
    connect?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
  };

  export type NearbyPlaceCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<
          NearbyPlaceCreateWithoutEventInput,
          NearbyPlaceUncheckedCreateWithoutEventInput
        >
      | NearbyPlaceCreateWithoutEventInput[]
      | NearbyPlaceUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | NearbyPlaceCreateOrConnectWithoutEventInput
      | NearbyPlaceCreateOrConnectWithoutEventInput[];
    createMany?: NearbyPlaceCreateManyEventInputEnvelope;
    connect?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
  };

  export type WaitlistEntryUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutEventInput,
          WaitlistEntryUncheckedCreateWithoutEventInput
        >
      | WaitlistEntryCreateWithoutEventInput[]
      | WaitlistEntryUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutEventInput
      | WaitlistEntryCreateOrConnectWithoutEventInput[];
    createMany?: WaitlistEntryCreateManyEventInputEnvelope;
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
  };

  export type ShowUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<ShowCreateWithoutEventInput, ShowUncheckedCreateWithoutEventInput>
      | ShowCreateWithoutEventInput[]
      | ShowUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | ShowCreateOrConnectWithoutEventInput
      | ShowCreateOrConnectWithoutEventInput[];
    createMany?: ShowCreateManyEventInputEnvelope;
    connect?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
  };

  export type NearbyPlaceUncheckedCreateNestedManyWithoutEventInput = {
    create?:
      | XOR<
          NearbyPlaceCreateWithoutEventInput,
          NearbyPlaceUncheckedCreateWithoutEventInput
        >
      | NearbyPlaceCreateWithoutEventInput[]
      | NearbyPlaceUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | NearbyPlaceCreateOrConnectWithoutEventInput
      | NearbyPlaceCreateOrConnectWithoutEventInput[];
    createMany?: NearbyPlaceCreateManyEventInputEnvelope;
    connect?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
  };

  export type EnumEventStatusFieldUpdateOperationsInput = {
    set?: $Enums.EventStatus;
  };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type EventUpdatetagsInput = {
    set?: string[];
    push?: string | string[];
  };

  export type UserUpdateOneRequiredWithoutOwnedEventsNestedInput = {
    create?: XOR<
      UserCreateWithoutOwnedEventsInput,
      UserUncheckedCreateWithoutOwnedEventsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutOwnedEventsInput;
    upsert?: UserUpsertWithoutOwnedEventsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutOwnedEventsInput,
        UserUpdateWithoutOwnedEventsInput
      >,
      UserUncheckedUpdateWithoutOwnedEventsInput
    >;
  };

  export type VenueUpdateOneWithoutEventsNestedInput = {
    create?: XOR<
      VenueCreateWithoutEventsInput,
      VenueUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: VenueCreateOrConnectWithoutEventsInput;
    upsert?: VenueUpsertWithoutEventsInput;
    disconnect?: VenueWhereInput | boolean;
    delete?: VenueWhereInput | boolean;
    connect?: VenueWhereUniqueInput;
    update?: XOR<
      XOR<
        VenueUpdateToOneWithWhereWithoutEventsInput,
        VenueUpdateWithoutEventsInput
      >,
      VenueUncheckedUpdateWithoutEventsInput
    >;
  };

  export type CategoryUpdateOneWithoutEventsNestedInput = {
    create?: XOR<
      CategoryCreateWithoutEventsInput,
      CategoryUncheckedCreateWithoutEventsInput
    >;
    connectOrCreate?: CategoryCreateOrConnectWithoutEventsInput;
    upsert?: CategoryUpsertWithoutEventsInput;
    disconnect?: CategoryWhereInput | boolean;
    delete?: CategoryWhereInput | boolean;
    connect?: CategoryWhereUniqueInput;
    update?: XOR<
      XOR<
        CategoryUpdateToOneWithWhereWithoutEventsInput,
        CategoryUpdateWithoutEventsInput
      >,
      CategoryUncheckedUpdateWithoutEventsInput
    >;
  };

  export type WaitlistEntryUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutEventInput,
          WaitlistEntryUncheckedCreateWithoutEventInput
        >
      | WaitlistEntryCreateWithoutEventInput[]
      | WaitlistEntryUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutEventInput
      | WaitlistEntryCreateOrConnectWithoutEventInput[];
    upsert?:
      | WaitlistEntryUpsertWithWhereUniqueWithoutEventInput
      | WaitlistEntryUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: WaitlistEntryCreateManyEventInputEnvelope;
    set?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    disconnect?:
      | WaitlistEntryWhereUniqueInput
      | WaitlistEntryWhereUniqueInput[];
    delete?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    update?:
      | WaitlistEntryUpdateWithWhereUniqueWithoutEventInput
      | WaitlistEntryUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | WaitlistEntryUpdateManyWithWhereWithoutEventInput
      | WaitlistEntryUpdateManyWithWhereWithoutEventInput[];
    deleteMany?:
      | WaitlistEntryScalarWhereInput
      | WaitlistEntryScalarWhereInput[];
  };

  export type ShowUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<ShowCreateWithoutEventInput, ShowUncheckedCreateWithoutEventInput>
      | ShowCreateWithoutEventInput[]
      | ShowUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | ShowCreateOrConnectWithoutEventInput
      | ShowCreateOrConnectWithoutEventInput[];
    upsert?:
      | ShowUpsertWithWhereUniqueWithoutEventInput
      | ShowUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: ShowCreateManyEventInputEnvelope;
    set?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    disconnect?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    delete?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    connect?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    update?:
      | ShowUpdateWithWhereUniqueWithoutEventInput
      | ShowUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | ShowUpdateManyWithWhereWithoutEventInput
      | ShowUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: ShowScalarWhereInput | ShowScalarWhereInput[];
  };

  export type NearbyPlaceUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<
          NearbyPlaceCreateWithoutEventInput,
          NearbyPlaceUncheckedCreateWithoutEventInput
        >
      | NearbyPlaceCreateWithoutEventInput[]
      | NearbyPlaceUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | NearbyPlaceCreateOrConnectWithoutEventInput
      | NearbyPlaceCreateOrConnectWithoutEventInput[];
    upsert?:
      | NearbyPlaceUpsertWithWhereUniqueWithoutEventInput
      | NearbyPlaceUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: NearbyPlaceCreateManyEventInputEnvelope;
    set?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    disconnect?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    delete?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    connect?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    update?:
      | NearbyPlaceUpdateWithWhereUniqueWithoutEventInput
      | NearbyPlaceUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | NearbyPlaceUpdateManyWithWhereWithoutEventInput
      | NearbyPlaceUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: NearbyPlaceScalarWhereInput | NearbyPlaceScalarWhereInput[];
  };

  export type WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<
          WaitlistEntryCreateWithoutEventInput,
          WaitlistEntryUncheckedCreateWithoutEventInput
        >
      | WaitlistEntryCreateWithoutEventInput[]
      | WaitlistEntryUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | WaitlistEntryCreateOrConnectWithoutEventInput
      | WaitlistEntryCreateOrConnectWithoutEventInput[];
    upsert?:
      | WaitlistEntryUpsertWithWhereUniqueWithoutEventInput
      | WaitlistEntryUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: WaitlistEntryCreateManyEventInputEnvelope;
    set?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    disconnect?:
      | WaitlistEntryWhereUniqueInput
      | WaitlistEntryWhereUniqueInput[];
    delete?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    connect?: WaitlistEntryWhereUniqueInput | WaitlistEntryWhereUniqueInput[];
    update?:
      | WaitlistEntryUpdateWithWhereUniqueWithoutEventInput
      | WaitlistEntryUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | WaitlistEntryUpdateManyWithWhereWithoutEventInput
      | WaitlistEntryUpdateManyWithWhereWithoutEventInput[];
    deleteMany?:
      | WaitlistEntryScalarWhereInput
      | WaitlistEntryScalarWhereInput[];
  };

  export type ShowUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<ShowCreateWithoutEventInput, ShowUncheckedCreateWithoutEventInput>
      | ShowCreateWithoutEventInput[]
      | ShowUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | ShowCreateOrConnectWithoutEventInput
      | ShowCreateOrConnectWithoutEventInput[];
    upsert?:
      | ShowUpsertWithWhereUniqueWithoutEventInput
      | ShowUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: ShowCreateManyEventInputEnvelope;
    set?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    disconnect?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    delete?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    connect?: ShowWhereUniqueInput | ShowWhereUniqueInput[];
    update?:
      | ShowUpdateWithWhereUniqueWithoutEventInput
      | ShowUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | ShowUpdateManyWithWhereWithoutEventInput
      | ShowUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: ShowScalarWhereInput | ShowScalarWhereInput[];
  };

  export type NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput = {
    create?:
      | XOR<
          NearbyPlaceCreateWithoutEventInput,
          NearbyPlaceUncheckedCreateWithoutEventInput
        >
      | NearbyPlaceCreateWithoutEventInput[]
      | NearbyPlaceUncheckedCreateWithoutEventInput[];
    connectOrCreate?:
      | NearbyPlaceCreateOrConnectWithoutEventInput
      | NearbyPlaceCreateOrConnectWithoutEventInput[];
    upsert?:
      | NearbyPlaceUpsertWithWhereUniqueWithoutEventInput
      | NearbyPlaceUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: NearbyPlaceCreateManyEventInputEnvelope;
    set?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    disconnect?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    delete?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    connect?: NearbyPlaceWhereUniqueInput | NearbyPlaceWhereUniqueInput[];
    update?:
      | NearbyPlaceUpdateWithWhereUniqueWithoutEventInput
      | NearbyPlaceUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?:
      | NearbyPlaceUpdateManyWithWhereWithoutEventInput
      | NearbyPlaceUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: NearbyPlaceScalarWhereInput | NearbyPlaceScalarWhereInput[];
  };

  export type EventCreateNestedManyWithoutVenueInput = {
    create?:
      | XOR<EventCreateWithoutVenueInput, EventUncheckedCreateWithoutVenueInput>
      | EventCreateWithoutVenueInput[]
      | EventUncheckedCreateWithoutVenueInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutVenueInput
      | EventCreateOrConnectWithoutVenueInput[];
    createMany?: EventCreateManyVenueInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type EventUncheckedCreateNestedManyWithoutVenueInput = {
    create?:
      | XOR<EventCreateWithoutVenueInput, EventUncheckedCreateWithoutVenueInput>
      | EventCreateWithoutVenueInput[]
      | EventUncheckedCreateWithoutVenueInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutVenueInput
      | EventCreateOrConnectWithoutVenueInput[];
    createMany?: EventCreateManyVenueInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type EventUpdateManyWithoutVenueNestedInput = {
    create?:
      | XOR<EventCreateWithoutVenueInput, EventUncheckedCreateWithoutVenueInput>
      | EventCreateWithoutVenueInput[]
      | EventUncheckedCreateWithoutVenueInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutVenueInput
      | EventCreateOrConnectWithoutVenueInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutVenueInput
      | EventUpsertWithWhereUniqueWithoutVenueInput[];
    createMany?: EventCreateManyVenueInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutVenueInput
      | EventUpdateWithWhereUniqueWithoutVenueInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutVenueInput
      | EventUpdateManyWithWhereWithoutVenueInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type EventUncheckedUpdateManyWithoutVenueNestedInput = {
    create?:
      | XOR<EventCreateWithoutVenueInput, EventUncheckedCreateWithoutVenueInput>
      | EventCreateWithoutVenueInput[]
      | EventUncheckedCreateWithoutVenueInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutVenueInput
      | EventCreateOrConnectWithoutVenueInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutVenueInput
      | EventUpsertWithWhereUniqueWithoutVenueInput[];
    createMany?: EventCreateManyVenueInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutVenueInput
      | EventUpdateWithWhereUniqueWithoutVenueInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutVenueInput
      | EventUpdateManyWithWhereWithoutVenueInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type EventCreateNestedOneWithoutWaitlistInput = {
    create?: XOR<
      EventCreateWithoutWaitlistInput,
      EventUncheckedCreateWithoutWaitlistInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutWaitlistInput;
    connect?: EventWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutWaitlistEntriesInput = {
    create?: XOR<
      UserCreateWithoutWaitlistEntriesInput,
      UserUncheckedCreateWithoutWaitlistEntriesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutWaitlistEntriesInput;
    connect?: UserWhereUniqueInput;
  };

  export type EnumWaitlistStatusFieldUpdateOperationsInput = {
    set?: $Enums.WaitlistStatus;
  };

  export type EventUpdateOneRequiredWithoutWaitlistNestedInput = {
    create?: XOR<
      EventCreateWithoutWaitlistInput,
      EventUncheckedCreateWithoutWaitlistInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutWaitlistInput;
    upsert?: EventUpsertWithoutWaitlistInput;
    connect?: EventWhereUniqueInput;
    update?: XOR<
      XOR<
        EventUpdateToOneWithWhereWithoutWaitlistInput,
        EventUpdateWithoutWaitlistInput
      >,
      EventUncheckedUpdateWithoutWaitlistInput
    >;
  };

  export type UserUpdateOneWithoutWaitlistEntriesNestedInput = {
    create?: XOR<
      UserCreateWithoutWaitlistEntriesInput,
      UserUncheckedCreateWithoutWaitlistEntriesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutWaitlistEntriesInput;
    upsert?: UserUpsertWithoutWaitlistEntriesInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutWaitlistEntriesInput,
        UserUpdateWithoutWaitlistEntriesInput
      >,
      UserUncheckedUpdateWithoutWaitlistEntriesInput
    >;
  };

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput;
    upsert?: UserUpsertWithoutSessionsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutSessionsInput,
        UserUpdateWithoutSessionsInput
      >,
      UserUncheckedUpdateWithoutSessionsInput
    >;
  };

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput;
    upsert?: UserUpsertWithoutAuditLogsInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAuditLogsInput,
        UserUpdateWithoutAuditLogsInput
      >,
      UserUncheckedUpdateWithoutAuditLogsInput
    >;
  };

  export type EventCreateNestedOneWithoutShowsInput = {
    create?: XOR<
      EventCreateWithoutShowsInput,
      EventUncheckedCreateWithoutShowsInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutShowsInput;
    connect?: EventWhereUniqueInput;
  };

  export type EventUpdateOneRequiredWithoutShowsNestedInput = {
    create?: XOR<
      EventCreateWithoutShowsInput,
      EventUncheckedCreateWithoutShowsInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutShowsInput;
    upsert?: EventUpsertWithoutShowsInput;
    connect?: EventWhereUniqueInput;
    update?: XOR<
      XOR<
        EventUpdateToOneWithWhereWithoutShowsInput,
        EventUpdateWithoutShowsInput
      >,
      EventUncheckedUpdateWithoutShowsInput
    >;
  };

  export type EventCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<
          EventCreateWithoutCategoryInput,
          EventUncheckedCreateWithoutCategoryInput
        >
      | EventCreateWithoutCategoryInput[]
      | EventUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutCategoryInput
      | EventCreateOrConnectWithoutCategoryInput[];
    createMany?: EventCreateManyCategoryInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type EventUncheckedCreateNestedManyWithoutCategoryInput = {
    create?:
      | XOR<
          EventCreateWithoutCategoryInput,
          EventUncheckedCreateWithoutCategoryInput
        >
      | EventCreateWithoutCategoryInput[]
      | EventUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutCategoryInput
      | EventCreateOrConnectWithoutCategoryInput[];
    createMany?: EventCreateManyCategoryInputEnvelope;
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
  };

  export type EventUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<
          EventCreateWithoutCategoryInput,
          EventUncheckedCreateWithoutCategoryInput
        >
      | EventCreateWithoutCategoryInput[]
      | EventUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutCategoryInput
      | EventCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutCategoryInput
      | EventUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: EventCreateManyCategoryInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutCategoryInput
      | EventUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutCategoryInput
      | EventUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type EventUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?:
      | XOR<
          EventCreateWithoutCategoryInput,
          EventUncheckedCreateWithoutCategoryInput
        >
      | EventCreateWithoutCategoryInput[]
      | EventUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?:
      | EventCreateOrConnectWithoutCategoryInput
      | EventCreateOrConnectWithoutCategoryInput[];
    upsert?:
      | EventUpsertWithWhereUniqueWithoutCategoryInput
      | EventUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: EventCreateManyCategoryInputEnvelope;
    set?: EventWhereUniqueInput | EventWhereUniqueInput[];
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[];
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[];
    update?:
      | EventUpdateWithWhereUniqueWithoutCategoryInput
      | EventUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?:
      | EventUpdateManyWithWhereWithoutCategoryInput
      | EventUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutEmailVerificationsInput = {
    create?: XOR<
      UserCreateWithoutEmailVerificationsInput,
      UserUncheckedCreateWithoutEmailVerificationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEmailVerificationsInput;
    connect?: UserWhereUniqueInput;
  };

  export type EnumEmailVerificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.EmailVerificationType;
  };

  export type UserUpdateOneWithoutEmailVerificationsNestedInput = {
    create?: XOR<
      UserCreateWithoutEmailVerificationsInput,
      UserUncheckedCreateWithoutEmailVerificationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutEmailVerificationsInput;
    upsert?: UserUpsertWithoutEmailVerificationsInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutEmailVerificationsInput,
        UserUpdateWithoutEmailVerificationsInput
      >,
      UserUncheckedUpdateWithoutEmailVerificationsInput
    >;
  };

  export type UserCreateNestedOneWithoutConsentsInput = {
    create?: XOR<
      UserCreateWithoutConsentsInput,
      UserUncheckedCreateWithoutConsentsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutConsentsInput;
    connect?: UserWhereUniqueInput;
  };

  export type EnumConsentTypeFieldUpdateOperationsInput = {
    set?: $Enums.ConsentType;
  };

  export type UserUpdateOneRequiredWithoutConsentsNestedInput = {
    create?: XOR<
      UserCreateWithoutConsentsInput,
      UserUncheckedCreateWithoutConsentsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutConsentsInput;
    upsert?: UserUpsertWithoutConsentsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutConsentsInput,
        UserUpdateWithoutConsentsInput
      >,
      UserUncheckedUpdateWithoutConsentsInput
    >;
  };

  export type EventCreateNestedOneWithoutNearbyPlacesInput = {
    create?: XOR<
      EventCreateWithoutNearbyPlacesInput,
      EventUncheckedCreateWithoutNearbyPlacesInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutNearbyPlacesInput;
    connect?: EventWhereUniqueInput;
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type EventUpdateOneRequiredWithoutNearbyPlacesNestedInput = {
    create?: XOR<
      EventCreateWithoutNearbyPlacesInput,
      EventUncheckedCreateWithoutNearbyPlacesInput
    >;
    connectOrCreate?: EventCreateOrConnectWithoutNearbyPlacesInput;
    upsert?: EventUpsertWithoutNearbyPlacesInput;
    connect?: EventWhereUniqueInput;
    update?: XOR<
      XOR<
        EventUpdateToOneWithWhereWithoutNearbyPlacesInput,
        EventUpdateWithoutNearbyPlacesInput
      >,
      EventUncheckedUpdateWithoutNearbyPlacesInput
    >;
  };

  export type UserCreateNestedOneWithoutInvitationsSentInput = {
    create?: XOR<
      UserCreateWithoutInvitationsSentInput,
      UserUncheckedCreateWithoutInvitationsSentInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutInvitationsSentInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutInvitationsReceivedInput = {
    create?: XOR<
      UserCreateWithoutInvitationsReceivedInput,
      UserUncheckedCreateWithoutInvitationsReceivedInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutInvitationsReceivedInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserUpdateOneRequiredWithoutInvitationsSentNestedInput = {
    create?: XOR<
      UserCreateWithoutInvitationsSentInput,
      UserUncheckedCreateWithoutInvitationsSentInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutInvitationsSentInput;
    upsert?: UserUpsertWithoutInvitationsSentInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutInvitationsSentInput,
        UserUpdateWithoutInvitationsSentInput
      >,
      UserUncheckedUpdateWithoutInvitationsSentInput
    >;
  };

  export type UserUpdateOneWithoutInvitationsReceivedNestedInput = {
    create?: XOR<
      UserCreateWithoutInvitationsReceivedInput,
      UserUncheckedCreateWithoutInvitationsReceivedInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutInvitationsReceivedInput;
    upsert?: UserUpsertWithoutInvitationsReceivedInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutInvitationsReceivedInput,
        UserUpdateWithoutInvitationsReceivedInput
      >,
      UserUncheckedUpdateWithoutInvitationsReceivedInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumUserRoleWithAggregatesFilter<$PrismaModel>
      | $Enums.UserRole;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: NestedEnumUserRoleFilter<$PrismaModel>;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedEnumEventStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.EventStatus[] | ListEnumEventStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EventStatus[]
      | ListEnumEventStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumEventStatusFilter<$PrismaModel> | $Enums.EventStatus;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumEventStatusWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: $Enums.EventStatus | EnumEventStatusFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.EventStatus[]
        | ListEnumEventStatusFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.EventStatus[]
        | ListEnumEventStatusFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumEventStatusWithAggregatesFilter<$PrismaModel>
        | $Enums.EventStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumEventStatusFilter<$PrismaModel>;
      _max?: NestedEnumEventStatusFilter<$PrismaModel>;
    };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedFloatNullableFilter<$PrismaModel>;
    _min?: NestedFloatNullableFilter<$PrismaModel>;
    _max?: NestedFloatNullableFilter<$PrismaModel>;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type NestedEnumWaitlistStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.WaitlistStatus
      | EnumWaitlistStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumWaitlistStatusFilter<$PrismaModel> | $Enums.WaitlistStatus;
  };

  export type NestedEnumWaitlistStatusWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.WaitlistStatus
      | EnumWaitlistStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.WaitlistStatus[]
      | ListEnumWaitlistStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumWaitlistStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.WaitlistStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumWaitlistStatusFilter<$PrismaModel>;
    _max?: NestedEnumWaitlistStatusFilter<$PrismaModel>;
  };

  export type NestedEnumEmailVerificationTypeFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.EmailVerificationType
      | EnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumEmailVerificationTypeFilter<$PrismaModel>
      | $Enums.EmailVerificationType;
  };

  export type NestedEnumEmailVerificationTypeWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.EmailVerificationType
      | EnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.EmailVerificationType[]
      | ListEnumEmailVerificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumEmailVerificationTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.EmailVerificationType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumEmailVerificationTypeFilter<$PrismaModel>;
    _max?: NestedEnumEmailVerificationTypeFilter<$PrismaModel>;
  };

  export type NestedEnumConsentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ConsentType[] | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.ConsentType[]
      | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumConsentTypeFilter<$PrismaModel> | $Enums.ConsentType;
  };

  export type NestedEnumConsentTypeWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: $Enums.ConsentType | EnumConsentTypeFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.ConsentType[]
        | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.ConsentType[]
        | ListEnumConsentTypeFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumConsentTypeWithAggregatesFilter<$PrismaModel>
        | $Enums.ConsentType;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumConsentTypeFilter<$PrismaModel>;
      _max?: NestedEnumConsentTypeFilter<$PrismaModel>;
    };

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedFloatFilter<$PrismaModel>;
    _min?: NestedFloatFilter<$PrismaModel>;
    _max?: NestedFloatFilter<$PrismaModel>;
  };

  export type EventCreateWithoutOwnerInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    venue?: VenueCreateNestedOneWithoutEventsInput;
    category?: CategoryCreateNestedOneWithoutEventsInput;
    waitlist?: WaitlistEntryCreateNestedManyWithoutEventInput;
    shows?: ShowCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutOwnerInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlist?: WaitlistEntryUncheckedCreateNestedManyWithoutEventInput;
    shows?: ShowUncheckedCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutOwnerInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutOwnerInput,
      EventUncheckedCreateWithoutOwnerInput
    >;
  };

  export type EventCreateManyOwnerInputEnvelope = {
    data: EventCreateManyOwnerInput | EventCreateManyOwnerInput[];
    skipDuplicates?: boolean;
  };

  export type WaitlistEntryCreateWithoutUserInput = {
    id?: string;
    email: string;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    event: EventCreateNestedOneWithoutWaitlistInput;
  };

  export type WaitlistEntryUncheckedCreateWithoutUserInput = {
    id?: string;
    email: string;
    eventId: string;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type WaitlistEntryCreateOrConnectWithoutUserInput = {
    where: WaitlistEntryWhereUniqueInput;
    create: XOR<
      WaitlistEntryCreateWithoutUserInput,
      WaitlistEntryUncheckedCreateWithoutUserInput
    >;
  };

  export type WaitlistEntryCreateManyUserInputEnvelope = {
    data: WaitlistEntryCreateManyUserInput | WaitlistEntryCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type SessionCreateWithoutUserInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput;
    create: XOR<
      SessionCreateWithoutUserInput,
      SessionUncheckedCreateWithoutUserInput
    >;
  };

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type AuditLogCreateWithoutUserInput = {
    id?: string;
    action: string;
    resource: string;
    resourceId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string;
    action: string;
    resource: string;
    resourceId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput;
    create: XOR<
      AuditLogCreateWithoutUserInput,
      AuditLogUncheckedCreateWithoutUserInput
    >;
  };

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type EmailVerificationCreateWithoutUserInput = {
    id?: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date | string;
    verifiedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type EmailVerificationUncheckedCreateWithoutUserInput = {
    id?: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date | string;
    verifiedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type EmailVerificationCreateOrConnectWithoutUserInput = {
    where: EmailVerificationWhereUniqueInput;
    create: XOR<
      EmailVerificationCreateWithoutUserInput,
      EmailVerificationUncheckedCreateWithoutUserInput
    >;
  };

  export type EmailVerificationCreateManyUserInputEnvelope = {
    data:
      | EmailVerificationCreateManyUserInput
      | EmailVerificationCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type ConsentCreateWithoutUserInput = {
    id?: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt?: Date | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ConsentUncheckedCreateWithoutUserInput = {
    id?: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt?: Date | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type ConsentCreateOrConnectWithoutUserInput = {
    where: ConsentWhereUniqueInput;
    create: XOR<
      ConsentCreateWithoutUserInput,
      ConsentUncheckedCreateWithoutUserInput
    >;
  };

  export type ConsentCreateManyUserInputEnvelope = {
    data: ConsentCreateManyUserInput | ConsentCreateManyUserInput[];
    skipDuplicates?: boolean;
  };

  export type InvitationCreateWithoutInviterInput = {
    id?: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    invitee?: UserCreateNestedOneWithoutInvitationsReceivedInput;
  };

  export type InvitationUncheckedCreateWithoutInviterInput = {
    id?: string;
    email: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type InvitationCreateOrConnectWithoutInviterInput = {
    where: InvitationWhereUniqueInput;
    create: XOR<
      InvitationCreateWithoutInviterInput,
      InvitationUncheckedCreateWithoutInviterInput
    >;
  };

  export type InvitationCreateManyInviterInputEnvelope = {
    data: InvitationCreateManyInviterInput | InvitationCreateManyInviterInput[];
    skipDuplicates?: boolean;
  };

  export type InvitationCreateWithoutInviteeInput = {
    id?: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
    inviter: UserCreateNestedOneWithoutInvitationsSentInput;
  };

  export type InvitationUncheckedCreateWithoutInviteeInput = {
    id?: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    invitedBy: string;
    createdAt?: Date | string;
  };

  export type InvitationCreateOrConnectWithoutInviteeInput = {
    where: InvitationWhereUniqueInput;
    create: XOR<
      InvitationCreateWithoutInviteeInput,
      InvitationUncheckedCreateWithoutInviteeInput
    >;
  };

  export type InvitationCreateManyInviteeInputEnvelope = {
    data: InvitationCreateManyInviteeInput | InvitationCreateManyInviteeInput[];
    skipDuplicates?: boolean;
  };

  export type EventUpsertWithWhereUniqueWithoutOwnerInput = {
    where: EventWhereUniqueInput;
    update: XOR<
      EventUpdateWithoutOwnerInput,
      EventUncheckedUpdateWithoutOwnerInput
    >;
    create: XOR<
      EventCreateWithoutOwnerInput,
      EventUncheckedCreateWithoutOwnerInput
    >;
  };

  export type EventUpdateWithWhereUniqueWithoutOwnerInput = {
    where: EventWhereUniqueInput;
    data: XOR<
      EventUpdateWithoutOwnerInput,
      EventUncheckedUpdateWithoutOwnerInput
    >;
  };

  export type EventUpdateManyWithWhereWithoutOwnerInput = {
    where: EventScalarWhereInput;
    data: XOR<
      EventUpdateManyMutationInput,
      EventUncheckedUpdateManyWithoutOwnerInput
    >;
  };

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[];
    OR?: EventScalarWhereInput[];
    NOT?: EventScalarWhereInput | EventScalarWhereInput[];
    id?: StringFilter<'Event'> | string;
    title?: StringFilter<'Event'> | string;
    slug?: StringFilter<'Event'> | string;
    description?: StringNullableFilter<'Event'> | string | null;
    shortDescription?: StringNullableFilter<'Event'> | string | null;
    status?: EnumEventStatusFilter<'Event'> | $Enums.EventStatus;
    startDate?: DateTimeFilter<'Event'> | Date | string;
    endDate?: DateTimeNullableFilter<'Event'> | Date | string | null;
    capacity?: IntNullableFilter<'Event'> | number | null;
    currentWaitlist?: IntFilter<'Event'> | number;
    youtubeUrl?: StringNullableFilter<'Event'> | string | null;
    mapLat?: FloatNullableFilter<'Event'> | number | null;
    mapLng?: FloatNullableFilter<'Event'> | number | null;
    mapZoom?: IntNullableFilter<'Event'> | number | null;
    mapAddress?: StringNullableFilter<'Event'> | string | null;
    ownerId?: StringFilter<'Event'> | string;
    venueId?: StringNullableFilter<'Event'> | string | null;
    categoryId?: StringNullableFilter<'Event'> | string | null;
    isPublic?: BoolFilter<'Event'> | boolean;
    featured?: BoolFilter<'Event'> | boolean;
    tags?: StringNullableListFilter<'Event'>;
    metadata?: JsonNullableFilter<'Event'>;
    createdAt?: DateTimeFilter<'Event'> | Date | string;
    updatedAt?: DateTimeFilter<'Event'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Event'> | Date | string | null;
  };

  export type WaitlistEntryUpsertWithWhereUniqueWithoutUserInput = {
    where: WaitlistEntryWhereUniqueInput;
    update: XOR<
      WaitlistEntryUpdateWithoutUserInput,
      WaitlistEntryUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      WaitlistEntryCreateWithoutUserInput,
      WaitlistEntryUncheckedCreateWithoutUserInput
    >;
  };

  export type WaitlistEntryUpdateWithWhereUniqueWithoutUserInput = {
    where: WaitlistEntryWhereUniqueInput;
    data: XOR<
      WaitlistEntryUpdateWithoutUserInput,
      WaitlistEntryUncheckedUpdateWithoutUserInput
    >;
  };

  export type WaitlistEntryUpdateManyWithWhereWithoutUserInput = {
    where: WaitlistEntryScalarWhereInput;
    data: XOR<
      WaitlistEntryUpdateManyMutationInput,
      WaitlistEntryUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type WaitlistEntryScalarWhereInput = {
    AND?: WaitlistEntryScalarWhereInput | WaitlistEntryScalarWhereInput[];
    OR?: WaitlistEntryScalarWhereInput[];
    NOT?: WaitlistEntryScalarWhereInput | WaitlistEntryScalarWhereInput[];
    id?: StringFilter<'WaitlistEntry'> | string;
    email?: StringFilter<'WaitlistEntry'> | string;
    eventId?: StringFilter<'WaitlistEntry'> | string;
    userId?: StringNullableFilter<'WaitlistEntry'> | string | null;
    status?: EnumWaitlistStatusFilter<'WaitlistEntry'> | $Enums.WaitlistStatus;
    createdAt?: DateTimeFilter<'WaitlistEntry'> | Date | string;
    updatedAt?: DateTimeFilter<'WaitlistEntry'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'WaitlistEntry'> | Date | string | null;
  };

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    update: XOR<
      SessionUpdateWithoutUserInput,
      SessionUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      SessionCreateWithoutUserInput,
      SessionUncheckedCreateWithoutUserInput
    >;
  };

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput;
    data: XOR<
      SessionUpdateWithoutUserInput,
      SessionUncheckedUpdateWithoutUserInput
    >;
  };

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput;
    data: XOR<
      SessionUpdateManyMutationInput,
      SessionUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[];
    OR?: SessionScalarWhereInput[];
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[];
    id?: StringFilter<'Session'> | string;
    userId?: StringFilter<'Session'> | string;
    token?: StringFilter<'Session'> | string;
    expiresAt?: DateTimeFilter<'Session'> | Date | string;
    createdAt?: DateTimeFilter<'Session'> | Date | string;
    updatedAt?: DateTimeFilter<'Session'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Session'> | Date | string | null;
  };

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput;
    update: XOR<
      AuditLogUpdateWithoutUserInput,
      AuditLogUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      AuditLogCreateWithoutUserInput,
      AuditLogUncheckedCreateWithoutUserInput
    >;
  };

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput;
    data: XOR<
      AuditLogUpdateWithoutUserInput,
      AuditLogUncheckedUpdateWithoutUserInput
    >;
  };

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput;
    data: XOR<
      AuditLogUpdateManyMutationInput,
      AuditLogUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
    OR?: AuditLogScalarWhereInput[];
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[];
    id?: StringFilter<'AuditLog'> | string;
    action?: StringFilter<'AuditLog'> | string;
    resource?: StringFilter<'AuditLog'> | string;
    resourceId?: StringFilter<'AuditLog'> | string;
    userId?: StringNullableFilter<'AuditLog'> | string | null;
    ipAddress?: StringNullableFilter<'AuditLog'> | string | null;
    userAgent?: StringNullableFilter<'AuditLog'> | string | null;
    metadata?: JsonNullableFilter<'AuditLog'>;
    createdAt?: DateTimeFilter<'AuditLog'> | Date | string;
  };

  export type EmailVerificationUpsertWithWhereUniqueWithoutUserInput = {
    where: EmailVerificationWhereUniqueInput;
    update: XOR<
      EmailVerificationUpdateWithoutUserInput,
      EmailVerificationUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      EmailVerificationCreateWithoutUserInput,
      EmailVerificationUncheckedCreateWithoutUserInput
    >;
  };

  export type EmailVerificationUpdateWithWhereUniqueWithoutUserInput = {
    where: EmailVerificationWhereUniqueInput;
    data: XOR<
      EmailVerificationUpdateWithoutUserInput,
      EmailVerificationUncheckedUpdateWithoutUserInput
    >;
  };

  export type EmailVerificationUpdateManyWithWhereWithoutUserInput = {
    where: EmailVerificationScalarWhereInput;
    data: XOR<
      EmailVerificationUpdateManyMutationInput,
      EmailVerificationUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type EmailVerificationScalarWhereInput = {
    AND?:
      | EmailVerificationScalarWhereInput
      | EmailVerificationScalarWhereInput[];
    OR?: EmailVerificationScalarWhereInput[];
    NOT?:
      | EmailVerificationScalarWhereInput
      | EmailVerificationScalarWhereInput[];
    id?: StringFilter<'EmailVerification'> | string;
    email?: StringFilter<'EmailVerification'> | string;
    token?: StringFilter<'EmailVerification'> | string;
    type?:
      | EnumEmailVerificationTypeFilter<'EmailVerification'>
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFilter<'EmailVerification'> | Date | string;
    verifiedAt?:
      | DateTimeNullableFilter<'EmailVerification'>
      | Date
      | string
      | null;
    userId?: StringNullableFilter<'EmailVerification'> | string | null;
    createdAt?: DateTimeFilter<'EmailVerification'> | Date | string;
  };

  export type ConsentUpsertWithWhereUniqueWithoutUserInput = {
    where: ConsentWhereUniqueInput;
    update: XOR<
      ConsentUpdateWithoutUserInput,
      ConsentUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ConsentCreateWithoutUserInput,
      ConsentUncheckedCreateWithoutUserInput
    >;
  };

  export type ConsentUpdateWithWhereUniqueWithoutUserInput = {
    where: ConsentWhereUniqueInput;
    data: XOR<
      ConsentUpdateWithoutUserInput,
      ConsentUncheckedUpdateWithoutUserInput
    >;
  };

  export type ConsentUpdateManyWithWhereWithoutUserInput = {
    where: ConsentScalarWhereInput;
    data: XOR<
      ConsentUpdateManyMutationInput,
      ConsentUncheckedUpdateManyWithoutUserInput
    >;
  };

  export type ConsentScalarWhereInput = {
    AND?: ConsentScalarWhereInput | ConsentScalarWhereInput[];
    OR?: ConsentScalarWhereInput[];
    NOT?: ConsentScalarWhereInput | ConsentScalarWhereInput[];
    id?: StringFilter<'Consent'> | string;
    userId?: StringFilter<'Consent'> | string;
    type?: EnumConsentTypeFilter<'Consent'> | $Enums.ConsentType;
    granted?: BoolFilter<'Consent'> | boolean;
    grantedAt?: DateTimeNullableFilter<'Consent'> | Date | string | null;
    ipAddress?: StringNullableFilter<'Consent'> | string | null;
    userAgent?: StringNullableFilter<'Consent'> | string | null;
    createdAt?: DateTimeFilter<'Consent'> | Date | string;
    updatedAt?: DateTimeFilter<'Consent'> | Date | string;
  };

  export type InvitationUpsertWithWhereUniqueWithoutInviterInput = {
    where: InvitationWhereUniqueInput;
    update: XOR<
      InvitationUpdateWithoutInviterInput,
      InvitationUncheckedUpdateWithoutInviterInput
    >;
    create: XOR<
      InvitationCreateWithoutInviterInput,
      InvitationUncheckedCreateWithoutInviterInput
    >;
  };

  export type InvitationUpdateWithWhereUniqueWithoutInviterInput = {
    where: InvitationWhereUniqueInput;
    data: XOR<
      InvitationUpdateWithoutInviterInput,
      InvitationUncheckedUpdateWithoutInviterInput
    >;
  };

  export type InvitationUpdateManyWithWhereWithoutInviterInput = {
    where: InvitationScalarWhereInput;
    data: XOR<
      InvitationUpdateManyMutationInput,
      InvitationUncheckedUpdateManyWithoutInviterInput
    >;
  };

  export type InvitationScalarWhereInput = {
    AND?: InvitationScalarWhereInput | InvitationScalarWhereInput[];
    OR?: InvitationScalarWhereInput[];
    NOT?: InvitationScalarWhereInput | InvitationScalarWhereInput[];
    id?: StringFilter<'Invitation'> | string;
    email?: StringFilter<'Invitation'> | string;
    role?: EnumUserRoleFilter<'Invitation'> | $Enums.UserRole;
    token?: StringFilter<'Invitation'> | string;
    expiresAt?: DateTimeFilter<'Invitation'> | Date | string;
    acceptedAt?: DateTimeNullableFilter<'Invitation'> | Date | string | null;
    invitedBy?: StringFilter<'Invitation'> | string;
    createdAt?: DateTimeFilter<'Invitation'> | Date | string;
  };

  export type InvitationUpsertWithWhereUniqueWithoutInviteeInput = {
    where: InvitationWhereUniqueInput;
    update: XOR<
      InvitationUpdateWithoutInviteeInput,
      InvitationUncheckedUpdateWithoutInviteeInput
    >;
    create: XOR<
      InvitationCreateWithoutInviteeInput,
      InvitationUncheckedCreateWithoutInviteeInput
    >;
  };

  export type InvitationUpdateWithWhereUniqueWithoutInviteeInput = {
    where: InvitationWhereUniqueInput;
    data: XOR<
      InvitationUpdateWithoutInviteeInput,
      InvitationUncheckedUpdateWithoutInviteeInput
    >;
  };

  export type InvitationUpdateManyWithWhereWithoutInviteeInput = {
    where: InvitationScalarWhereInput;
    data: XOR<
      InvitationUpdateManyMutationInput,
      InvitationUncheckedUpdateManyWithoutInviteeInput
    >;
  };

  export type UserCreateWithoutOwnedEventsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutOwnedEventsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutOwnedEventsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutOwnedEventsInput,
      UserUncheckedCreateWithoutOwnedEventsInput
    >;
  };

  export type VenueCreateWithoutEventsInput = {
    id?: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    website?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type VenueUncheckedCreateWithoutEventsInput = {
    id?: string;
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    website?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type VenueCreateOrConnectWithoutEventsInput = {
    where: VenueWhereUniqueInput;
    create: XOR<
      VenueCreateWithoutEventsInput,
      VenueUncheckedCreateWithoutEventsInput
    >;
  };

  export type CategoryCreateWithoutEventsInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type CategoryUncheckedCreateWithoutEventsInput = {
    id?: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type CategoryCreateOrConnectWithoutEventsInput = {
    where: CategoryWhereUniqueInput;
    create: XOR<
      CategoryCreateWithoutEventsInput,
      CategoryUncheckedCreateWithoutEventsInput
    >;
  };

  export type WaitlistEntryCreateWithoutEventInput = {
    id?: string;
    email: string;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    user?: UserCreateNestedOneWithoutWaitlistEntriesInput;
  };

  export type WaitlistEntryUncheckedCreateWithoutEventInput = {
    id?: string;
    email: string;
    userId?: string | null;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type WaitlistEntryCreateOrConnectWithoutEventInput = {
    where: WaitlistEntryWhereUniqueInput;
    create: XOR<
      WaitlistEntryCreateWithoutEventInput,
      WaitlistEntryUncheckedCreateWithoutEventInput
    >;
  };

  export type WaitlistEntryCreateManyEventInputEnvelope = {
    data:
      | WaitlistEntryCreateManyEventInput
      | WaitlistEntryCreateManyEventInput[];
    skipDuplicates?: boolean;
  };

  export type ShowCreateWithoutEventInput = {
    id?: string;
    title: string;
    description?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type ShowUncheckedCreateWithoutEventInput = {
    id?: string;
    title: string;
    description?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type ShowCreateOrConnectWithoutEventInput = {
    where: ShowWhereUniqueInput;
    create: XOR<
      ShowCreateWithoutEventInput,
      ShowUncheckedCreateWithoutEventInput
    >;
  };

  export type ShowCreateManyEventInputEnvelope = {
    data: ShowCreateManyEventInput | ShowCreateManyEventInput[];
    skipDuplicates?: boolean;
  };

  export type NearbyPlaceCreateWithoutEventInput = {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating?: number | null;
    website?: string | null;
    phone?: string | null;
    distance?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type NearbyPlaceUncheckedCreateWithoutEventInput = {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating?: number | null;
    website?: string | null;
    phone?: string | null;
    distance?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type NearbyPlaceCreateOrConnectWithoutEventInput = {
    where: NearbyPlaceWhereUniqueInput;
    create: XOR<
      NearbyPlaceCreateWithoutEventInput,
      NearbyPlaceUncheckedCreateWithoutEventInput
    >;
  };

  export type NearbyPlaceCreateManyEventInputEnvelope = {
    data: NearbyPlaceCreateManyEventInput | NearbyPlaceCreateManyEventInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutOwnedEventsInput = {
    update: XOR<
      UserUpdateWithoutOwnedEventsInput,
      UserUncheckedUpdateWithoutOwnedEventsInput
    >;
    create: XOR<
      UserCreateWithoutOwnedEventsInput,
      UserUncheckedCreateWithoutOwnedEventsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutOwnedEventsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutOwnedEventsInput,
      UserUncheckedUpdateWithoutOwnedEventsInput
    >;
  };

  export type UserUpdateWithoutOwnedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutOwnedEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type VenueUpsertWithoutEventsInput = {
    update: XOR<
      VenueUpdateWithoutEventsInput,
      VenueUncheckedUpdateWithoutEventsInput
    >;
    create: XOR<
      VenueCreateWithoutEventsInput,
      VenueUncheckedCreateWithoutEventsInput
    >;
    where?: VenueWhereInput;
  };

  export type VenueUpdateToOneWithWhereWithoutEventsInput = {
    where?: VenueWhereInput;
    data: XOR<
      VenueUpdateWithoutEventsInput,
      VenueUncheckedUpdateWithoutEventsInput
    >;
  };

  export type VenueUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    city?: StringFieldUpdateOperationsInput | string;
    country?: StringFieldUpdateOperationsInput | string;
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type VenueUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    city?: StringFieldUpdateOperationsInput | string;
    country?: StringFieldUpdateOperationsInput | string;
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type CategoryUpsertWithoutEventsInput = {
    update: XOR<
      CategoryUpdateWithoutEventsInput,
      CategoryUncheckedUpdateWithoutEventsInput
    >;
    create: XOR<
      CategoryCreateWithoutEventsInput,
      CategoryUncheckedCreateWithoutEventsInput
    >;
    where?: CategoryWhereInput;
  };

  export type CategoryUpdateToOneWithWhereWithoutEventsInput = {
    where?: CategoryWhereInput;
    data: XOR<
      CategoryUpdateWithoutEventsInput,
      CategoryUncheckedUpdateWithoutEventsInput
    >;
  };

  export type CategoryUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type CategoryUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    color?: NullableStringFieldUpdateOperationsInput | string | null;
    icon?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryUpsertWithWhereUniqueWithoutEventInput = {
    where: WaitlistEntryWhereUniqueInput;
    update: XOR<
      WaitlistEntryUpdateWithoutEventInput,
      WaitlistEntryUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      WaitlistEntryCreateWithoutEventInput,
      WaitlistEntryUncheckedCreateWithoutEventInput
    >;
  };

  export type WaitlistEntryUpdateWithWhereUniqueWithoutEventInput = {
    where: WaitlistEntryWhereUniqueInput;
    data: XOR<
      WaitlistEntryUpdateWithoutEventInput,
      WaitlistEntryUncheckedUpdateWithoutEventInput
    >;
  };

  export type WaitlistEntryUpdateManyWithWhereWithoutEventInput = {
    where: WaitlistEntryScalarWhereInput;
    data: XOR<
      WaitlistEntryUpdateManyMutationInput,
      WaitlistEntryUncheckedUpdateManyWithoutEventInput
    >;
  };

  export type ShowUpsertWithWhereUniqueWithoutEventInput = {
    where: ShowWhereUniqueInput;
    update: XOR<
      ShowUpdateWithoutEventInput,
      ShowUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      ShowCreateWithoutEventInput,
      ShowUncheckedCreateWithoutEventInput
    >;
  };

  export type ShowUpdateWithWhereUniqueWithoutEventInput = {
    where: ShowWhereUniqueInput;
    data: XOR<
      ShowUpdateWithoutEventInput,
      ShowUncheckedUpdateWithoutEventInput
    >;
  };

  export type ShowUpdateManyWithWhereWithoutEventInput = {
    where: ShowScalarWhereInput;
    data: XOR<
      ShowUpdateManyMutationInput,
      ShowUncheckedUpdateManyWithoutEventInput
    >;
  };

  export type ShowScalarWhereInput = {
    AND?: ShowScalarWhereInput | ShowScalarWhereInput[];
    OR?: ShowScalarWhereInput[];
    NOT?: ShowScalarWhereInput | ShowScalarWhereInput[];
    id?: StringFilter<'Show'> | string;
    title?: StringFilter<'Show'> | string;
    description?: StringNullableFilter<'Show'> | string | null;
    startDate?: DateTimeFilter<'Show'> | Date | string;
    endDate?: DateTimeNullableFilter<'Show'> | Date | string | null;
    capacity?: IntNullableFilter<'Show'> | number | null;
    currentWaitlist?: IntFilter<'Show'> | number;
    youtubeUrl?: StringNullableFilter<'Show'> | string | null;
    eventId?: StringFilter<'Show'> | string;
    createdAt?: DateTimeFilter<'Show'> | Date | string;
    updatedAt?: DateTimeFilter<'Show'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'Show'> | Date | string | null;
  };

  export type NearbyPlaceUpsertWithWhereUniqueWithoutEventInput = {
    where: NearbyPlaceWhereUniqueInput;
    update: XOR<
      NearbyPlaceUpdateWithoutEventInput,
      NearbyPlaceUncheckedUpdateWithoutEventInput
    >;
    create: XOR<
      NearbyPlaceCreateWithoutEventInput,
      NearbyPlaceUncheckedCreateWithoutEventInput
    >;
  };

  export type NearbyPlaceUpdateWithWhereUniqueWithoutEventInput = {
    where: NearbyPlaceWhereUniqueInput;
    data: XOR<
      NearbyPlaceUpdateWithoutEventInput,
      NearbyPlaceUncheckedUpdateWithoutEventInput
    >;
  };

  export type NearbyPlaceUpdateManyWithWhereWithoutEventInput = {
    where: NearbyPlaceScalarWhereInput;
    data: XOR<
      NearbyPlaceUpdateManyMutationInput,
      NearbyPlaceUncheckedUpdateManyWithoutEventInput
    >;
  };

  export type NearbyPlaceScalarWhereInput = {
    AND?: NearbyPlaceScalarWhereInput | NearbyPlaceScalarWhereInput[];
    OR?: NearbyPlaceScalarWhereInput[];
    NOT?: NearbyPlaceScalarWhereInput | NearbyPlaceScalarWhereInput[];
    id?: StringFilter<'NearbyPlace'> | string;
    name?: StringFilter<'NearbyPlace'> | string;
    address?: StringFilter<'NearbyPlace'> | string;
    latitude?: FloatFilter<'NearbyPlace'> | number;
    longitude?: FloatFilter<'NearbyPlace'> | number;
    category?: StringFilter<'NearbyPlace'> | string;
    rating?: FloatNullableFilter<'NearbyPlace'> | number | null;
    website?: StringNullableFilter<'NearbyPlace'> | string | null;
    phone?: StringNullableFilter<'NearbyPlace'> | string | null;
    distance?: FloatNullableFilter<'NearbyPlace'> | number | null;
    eventId?: StringFilter<'NearbyPlace'> | string;
    createdAt?: DateTimeFilter<'NearbyPlace'> | Date | string;
    updatedAt?: DateTimeFilter<'NearbyPlace'> | Date | string;
  };

  export type EventCreateWithoutVenueInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: UserCreateNestedOneWithoutOwnedEventsInput;
    category?: CategoryCreateNestedOneWithoutEventsInput;
    waitlist?: WaitlistEntryCreateNestedManyWithoutEventInput;
    shows?: ShowCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutVenueInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlist?: WaitlistEntryUncheckedCreateNestedManyWithoutEventInput;
    shows?: ShowUncheckedCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutVenueInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutVenueInput,
      EventUncheckedCreateWithoutVenueInput
    >;
  };

  export type EventCreateManyVenueInputEnvelope = {
    data: EventCreateManyVenueInput | EventCreateManyVenueInput[];
    skipDuplicates?: boolean;
  };

  export type EventUpsertWithWhereUniqueWithoutVenueInput = {
    where: EventWhereUniqueInput;
    update: XOR<
      EventUpdateWithoutVenueInput,
      EventUncheckedUpdateWithoutVenueInput
    >;
    create: XOR<
      EventCreateWithoutVenueInput,
      EventUncheckedCreateWithoutVenueInput
    >;
  };

  export type EventUpdateWithWhereUniqueWithoutVenueInput = {
    where: EventWhereUniqueInput;
    data: XOR<
      EventUpdateWithoutVenueInput,
      EventUncheckedUpdateWithoutVenueInput
    >;
  };

  export type EventUpdateManyWithWhereWithoutVenueInput = {
    where: EventScalarWhereInput;
    data: XOR<
      EventUpdateManyMutationInput,
      EventUncheckedUpdateManyWithoutVenueInput
    >;
  };

  export type EventCreateWithoutWaitlistInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: UserCreateNestedOneWithoutOwnedEventsInput;
    venue?: VenueCreateNestedOneWithoutEventsInput;
    category?: CategoryCreateNestedOneWithoutEventsInput;
    shows?: ShowCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutWaitlistInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    shows?: ShowUncheckedCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutWaitlistInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutWaitlistInput,
      EventUncheckedCreateWithoutWaitlistInput
    >;
  };

  export type UserCreateWithoutWaitlistEntriesInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutWaitlistEntriesInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutWaitlistEntriesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutWaitlistEntriesInput,
      UserUncheckedCreateWithoutWaitlistEntriesInput
    >;
  };

  export type EventUpsertWithoutWaitlistInput = {
    update: XOR<
      EventUpdateWithoutWaitlistInput,
      EventUncheckedUpdateWithoutWaitlistInput
    >;
    create: XOR<
      EventCreateWithoutWaitlistInput,
      EventUncheckedCreateWithoutWaitlistInput
    >;
    where?: EventWhereInput;
  };

  export type EventUpdateToOneWithWhereWithoutWaitlistInput = {
    where?: EventWhereInput;
    data: XOR<
      EventUpdateWithoutWaitlistInput,
      EventUncheckedUpdateWithoutWaitlistInput
    >;
  };

  export type EventUpdateWithoutWaitlistInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    owner?: UserUpdateOneRequiredWithoutOwnedEventsNestedInput;
    venue?: VenueUpdateOneWithoutEventsNestedInput;
    category?: CategoryUpdateOneWithoutEventsNestedInput;
    shows?: ShowUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutWaitlistInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    shows?: ShowUncheckedUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type UserUpsertWithoutWaitlistEntriesInput = {
    update: XOR<
      UserUpdateWithoutWaitlistEntriesInput,
      UserUncheckedUpdateWithoutWaitlistEntriesInput
    >;
    create: XOR<
      UserCreateWithoutWaitlistEntriesInput,
      UserUncheckedCreateWithoutWaitlistEntriesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutWaitlistEntriesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutWaitlistEntriesInput,
      UserUncheckedUpdateWithoutWaitlistEntriesInput
    >;
  };

  export type UserUpdateWithoutWaitlistEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutWaitlistEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type UserCreateWithoutSessionsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
  };

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<
      UserUpdateWithoutSessionsInput,
      UserUncheckedUpdateWithoutSessionsInput
    >;
    create: XOR<
      UserCreateWithoutSessionsInput,
      UserUncheckedCreateWithoutSessionsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutSessionsInput,
      UserUncheckedUpdateWithoutSessionsInput
    >;
  };

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type UserCreateWithoutAuditLogsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
  };

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<
      UserUpdateWithoutAuditLogsInput,
      UserUncheckedUpdateWithoutAuditLogsInput
    >;
    create: XOR<
      UserCreateWithoutAuditLogsInput,
      UserUncheckedCreateWithoutAuditLogsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAuditLogsInput,
      UserUncheckedUpdateWithoutAuditLogsInput
    >;
  };

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type EventCreateWithoutShowsInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: UserCreateNestedOneWithoutOwnedEventsInput;
    venue?: VenueCreateNestedOneWithoutEventsInput;
    category?: CategoryCreateNestedOneWithoutEventsInput;
    waitlist?: WaitlistEntryCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutShowsInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlist?: WaitlistEntryUncheckedCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutShowsInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutShowsInput,
      EventUncheckedCreateWithoutShowsInput
    >;
  };

  export type EventUpsertWithoutShowsInput = {
    update: XOR<
      EventUpdateWithoutShowsInput,
      EventUncheckedUpdateWithoutShowsInput
    >;
    create: XOR<
      EventCreateWithoutShowsInput,
      EventUncheckedCreateWithoutShowsInput
    >;
    where?: EventWhereInput;
  };

  export type EventUpdateToOneWithWhereWithoutShowsInput = {
    where?: EventWhereInput;
    data: XOR<
      EventUpdateWithoutShowsInput,
      EventUncheckedUpdateWithoutShowsInput
    >;
  };

  export type EventUpdateWithoutShowsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    owner?: UserUpdateOneRequiredWithoutOwnedEventsNestedInput;
    venue?: VenueUpdateOneWithoutEventsNestedInput;
    category?: CategoryUpdateOneWithoutEventsNestedInput;
    waitlist?: WaitlistEntryUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutShowsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlist?: WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventCreateWithoutCategoryInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: UserCreateNestedOneWithoutOwnedEventsInput;
    venue?: VenueCreateNestedOneWithoutEventsInput;
    waitlist?: WaitlistEntryCreateNestedManyWithoutEventInput;
    shows?: ShowCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutCategoryInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlist?: WaitlistEntryUncheckedCreateNestedManyWithoutEventInput;
    shows?: ShowUncheckedCreateNestedManyWithoutEventInput;
    nearbyPlaces?: NearbyPlaceUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutCategoryInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutCategoryInput,
      EventUncheckedCreateWithoutCategoryInput
    >;
  };

  export type EventCreateManyCategoryInputEnvelope = {
    data: EventCreateManyCategoryInput | EventCreateManyCategoryInput[];
    skipDuplicates?: boolean;
  };

  export type EventUpsertWithWhereUniqueWithoutCategoryInput = {
    where: EventWhereUniqueInput;
    update: XOR<
      EventUpdateWithoutCategoryInput,
      EventUncheckedUpdateWithoutCategoryInput
    >;
    create: XOR<
      EventCreateWithoutCategoryInput,
      EventUncheckedCreateWithoutCategoryInput
    >;
  };

  export type EventUpdateWithWhereUniqueWithoutCategoryInput = {
    where: EventWhereUniqueInput;
    data: XOR<
      EventUpdateWithoutCategoryInput,
      EventUncheckedUpdateWithoutCategoryInput
    >;
  };

  export type EventUpdateManyWithWhereWithoutCategoryInput = {
    where: EventScalarWhereInput;
    data: XOR<
      EventUpdateManyMutationInput,
      EventUncheckedUpdateManyWithoutCategoryInput
    >;
  };

  export type UserCreateWithoutEmailVerificationsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutEmailVerificationsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutEmailVerificationsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutEmailVerificationsInput,
      UserUncheckedCreateWithoutEmailVerificationsInput
    >;
  };

  export type UserUpsertWithoutEmailVerificationsInput = {
    update: XOR<
      UserUpdateWithoutEmailVerificationsInput,
      UserUncheckedUpdateWithoutEmailVerificationsInput
    >;
    create: XOR<
      UserCreateWithoutEmailVerificationsInput,
      UserUncheckedCreateWithoutEmailVerificationsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutEmailVerificationsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutEmailVerificationsInput,
      UserUncheckedUpdateWithoutEmailVerificationsInput
    >;
  };

  export type UserUpdateWithoutEmailVerificationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutEmailVerificationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type UserCreateWithoutConsentsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutConsentsInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutConsentsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutConsentsInput,
      UserUncheckedCreateWithoutConsentsInput
    >;
  };

  export type UserUpsertWithoutConsentsInput = {
    update: XOR<
      UserUpdateWithoutConsentsInput,
      UserUncheckedUpdateWithoutConsentsInput
    >;
    create: XOR<
      UserCreateWithoutConsentsInput,
      UserUncheckedCreateWithoutConsentsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutConsentsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutConsentsInput,
      UserUncheckedUpdateWithoutConsentsInput
    >;
  };

  export type UserUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type EventCreateWithoutNearbyPlacesInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    owner: UserCreateNestedOneWithoutOwnedEventsInput;
    venue?: VenueCreateNestedOneWithoutEventsInput;
    category?: CategoryCreateNestedOneWithoutEventsInput;
    waitlist?: WaitlistEntryCreateNestedManyWithoutEventInput;
    shows?: ShowCreateNestedManyWithoutEventInput;
  };

  export type EventUncheckedCreateWithoutNearbyPlacesInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    waitlist?: WaitlistEntryUncheckedCreateNestedManyWithoutEventInput;
    shows?: ShowUncheckedCreateNestedManyWithoutEventInput;
  };

  export type EventCreateOrConnectWithoutNearbyPlacesInput = {
    where: EventWhereUniqueInput;
    create: XOR<
      EventCreateWithoutNearbyPlacesInput,
      EventUncheckedCreateWithoutNearbyPlacesInput
    >;
  };

  export type EventUpsertWithoutNearbyPlacesInput = {
    update: XOR<
      EventUpdateWithoutNearbyPlacesInput,
      EventUncheckedUpdateWithoutNearbyPlacesInput
    >;
    create: XOR<
      EventCreateWithoutNearbyPlacesInput,
      EventUncheckedCreateWithoutNearbyPlacesInput
    >;
    where?: EventWhereInput;
  };

  export type EventUpdateToOneWithWhereWithoutNearbyPlacesInput = {
    where?: EventWhereInput;
    data: XOR<
      EventUpdateWithoutNearbyPlacesInput,
      EventUncheckedUpdateWithoutNearbyPlacesInput
    >;
  };

  export type EventUpdateWithoutNearbyPlacesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    owner?: UserUpdateOneRequiredWithoutOwnedEventsNestedInput;
    venue?: VenueUpdateOneWithoutEventsNestedInput;
    category?: CategoryUpdateOneWithoutEventsNestedInput;
    waitlist?: WaitlistEntryUpdateManyWithoutEventNestedInput;
    shows?: ShowUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutNearbyPlacesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlist?: WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput;
    shows?: ShowUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type UserCreateWithoutInvitationsSentInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsReceived?: InvitationCreateNestedManyWithoutInviteeInput;
  };

  export type UserUncheckedCreateWithoutInvitationsSentInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsReceived?: InvitationUncheckedCreateNestedManyWithoutInviteeInput;
  };

  export type UserCreateOrConnectWithoutInvitationsSentInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutInvitationsSentInput,
      UserUncheckedCreateWithoutInvitationsSentInput
    >;
  };

  export type UserCreateWithoutInvitationsReceivedInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryCreateNestedManyWithoutUserInput;
    sessions?: SessionCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationCreateNestedManyWithoutUserInput;
    consents?: ConsentCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationCreateNestedManyWithoutInviterInput;
  };

  export type UserUncheckedCreateWithoutInvitationsReceivedInput = {
    id?: string;
    email: string;
    name?: string | null;
    role?: $Enums.UserRole;
    isActive?: boolean;
    lastLoginAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
    ownedEvents?: EventUncheckedCreateNestedManyWithoutOwnerInput;
    waitlistEntries?: WaitlistEntryUncheckedCreateNestedManyWithoutUserInput;
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput;
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput;
    emailVerifications?: EmailVerificationUncheckedCreateNestedManyWithoutUserInput;
    consents?: ConsentUncheckedCreateNestedManyWithoutUserInput;
    invitationsSent?: InvitationUncheckedCreateNestedManyWithoutInviterInput;
  };

  export type UserCreateOrConnectWithoutInvitationsReceivedInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutInvitationsReceivedInput,
      UserUncheckedCreateWithoutInvitationsReceivedInput
    >;
  };

  export type UserUpsertWithoutInvitationsSentInput = {
    update: XOR<
      UserUpdateWithoutInvitationsSentInput,
      UserUncheckedUpdateWithoutInvitationsSentInput
    >;
    create: XOR<
      UserCreateWithoutInvitationsSentInput,
      UserUncheckedCreateWithoutInvitationsSentInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutInvitationsSentInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutInvitationsSentInput,
      UserUncheckedUpdateWithoutInvitationsSentInput
    >;
  };

  export type UserUpdateWithoutInvitationsSentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsReceived?: InvitationUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUncheckedUpdateWithoutInvitationsSentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsReceived?: InvitationUncheckedUpdateManyWithoutInviteeNestedInput;
  };

  export type UserUpsertWithoutInvitationsReceivedInput = {
    update: XOR<
      UserUpdateWithoutInvitationsReceivedInput,
      UserUncheckedUpdateWithoutInvitationsReceivedInput
    >;
    create: XOR<
      UserCreateWithoutInvitationsReceivedInput,
      UserUncheckedCreateWithoutInvitationsReceivedInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutInvitationsReceivedInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutInvitationsReceivedInput,
      UserUncheckedUpdateWithoutInvitationsReceivedInput
    >;
  };

  export type UserUpdateWithoutInvitationsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUpdateManyWithoutUserNestedInput;
    sessions?: SessionUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUpdateManyWithoutUserNestedInput;
    consents?: ConsentUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUpdateManyWithoutInviterNestedInput;
  };

  export type UserUncheckedUpdateWithoutInvitationsReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    lastLoginAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ownedEvents?: EventUncheckedUpdateManyWithoutOwnerNestedInput;
    waitlistEntries?: WaitlistEntryUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput;
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput;
    emailVerifications?: EmailVerificationUncheckedUpdateManyWithoutUserNestedInput;
    consents?: ConsentUncheckedUpdateManyWithoutUserNestedInput;
    invitationsSent?: InvitationUncheckedUpdateManyWithoutInviterNestedInput;
  };

  export type EventCreateManyOwnerInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    venueId?: string | null;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type WaitlistEntryCreateManyUserInput = {
    id?: string;
    email: string;
    eventId: string;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type SessionCreateManyUserInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type AuditLogCreateManyUserInput = {
    id?: string;
    action: string;
    resource: string;
    resourceId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
  };

  export type EmailVerificationCreateManyUserInput = {
    id?: string;
    email: string;
    token: string;
    type: $Enums.EmailVerificationType;
    expiresAt: Date | string;
    verifiedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type ConsentCreateManyUserInput = {
    id?: string;
    type: $Enums.ConsentType;
    granted: boolean;
    grantedAt?: Date | string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type InvitationCreateManyInviterInput = {
    id?: string;
    email: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type InvitationCreateManyInviteeInput = {
    id?: string;
    role: $Enums.UserRole;
    token: string;
    expiresAt: Date | string;
    acceptedAt?: Date | string | null;
    invitedBy: string;
    createdAt?: Date | string;
  };

  export type EventUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    venue?: VenueUpdateOneWithoutEventsNestedInput;
    category?: CategoryUpdateOneWithoutEventsNestedInput;
    waitlist?: WaitlistEntryUpdateManyWithoutEventNestedInput;
    shows?: ShowUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlist?: WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput;
    shows?: ShowUncheckedUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    event?: EventUpdateOneRequiredWithoutWaitlistNestedInput;
  };

  export type WaitlistEntryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    eventId?: StringFieldUpdateOperationsInput | string;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    action?: StringFieldUpdateOperationsInput | string;
    resource?: StringFieldUpdateOperationsInput | string;
    resourceId?: StringFieldUpdateOperationsInput | string;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EmailVerificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EmailVerificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EmailVerificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumEmailVerificationTypeFieldUpdateOperationsInput
      | $Enums.EmailVerificationType;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    verifiedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ConsentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ConsentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ConsentUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?: EnumConsentTypeFieldUpdateOperationsInput | $Enums.ConsentType;
    granted?: BoolFieldUpdateOperationsInput | boolean;
    grantedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationUpdateWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    invitee?: UserUpdateOneWithoutInvitationsReceivedNestedInput;
  };

  export type InvitationUncheckedUpdateWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationUncheckedUpdateManyWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationUpdateWithoutInviteeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inviter?: UserUpdateOneRequiredWithoutInvitationsSentNestedInput;
  };

  export type InvitationUncheckedUpdateWithoutInviteeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    invitedBy?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type InvitationUncheckedUpdateManyWithoutInviteeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    acceptedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    invitedBy?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type WaitlistEntryCreateManyEventInput = {
    id?: string;
    email: string;
    userId?: string | null;
    status?: $Enums.WaitlistStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type ShowCreateManyEventInput = {
    id?: string;
    title: string;
    description?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type NearbyPlaceCreateManyEventInput = {
    id?: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating?: number | null;
    website?: string | null;
    phone?: string | null;
    distance?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type WaitlistEntryUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user?: UserUpdateOneWithoutWaitlistEntriesNestedInput;
  };

  export type WaitlistEntryUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type WaitlistEntryUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    userId?: NullableStringFieldUpdateOperationsInput | string | null;
    status?:
      | EnumWaitlistStatusFieldUpdateOperationsInput
      | $Enums.WaitlistStatus;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ShowUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ShowUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ShowUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type NearbyPlaceUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NearbyPlaceUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NearbyPlaceUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    latitude?: FloatFieldUpdateOperationsInput | number;
    longitude?: FloatFieldUpdateOperationsInput | number;
    category?: StringFieldUpdateOperationsInput | string;
    rating?: NullableFloatFieldUpdateOperationsInput | number | null;
    website?: NullableStringFieldUpdateOperationsInput | string | null;
    phone?: NullableStringFieldUpdateOperationsInput | string | null;
    distance?: NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type EventCreateManyVenueInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    categoryId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type EventUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    owner?: UserUpdateOneRequiredWithoutOwnedEventsNestedInput;
    category?: CategoryUpdateOneWithoutEventsNestedInput;
    waitlist?: WaitlistEntryUpdateManyWithoutEventNestedInput;
    shows?: ShowUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlist?: WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput;
    shows?: ShowUncheckedUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateManyWithoutVenueInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type EventCreateManyCategoryInput = {
    id?: string;
    title: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    status?: $Enums.EventStatus;
    startDate: Date | string;
    endDate?: Date | string | null;
    capacity?: number | null;
    currentWaitlist?: number;
    youtubeUrl?: string | null;
    mapLat?: number | null;
    mapLng?: number | null;
    mapZoom?: number | null;
    mapAddress?: string | null;
    ownerId: string;
    venueId?: string | null;
    isPublic?: boolean;
    featured?: boolean;
    tags?: EventCreatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type EventUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    owner?: UserUpdateOneRequiredWithoutOwnedEventsNestedInput;
    venue?: VenueUpdateOneWithoutEventsNestedInput;
    waitlist?: WaitlistEntryUpdateManyWithoutEventNestedInput;
    shows?: ShowUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    waitlist?: WaitlistEntryUncheckedUpdateManyWithoutEventNestedInput;
    shows?: ShowUncheckedUpdateManyWithoutEventNestedInput;
    nearbyPlaces?: NearbyPlaceUncheckedUpdateManyWithoutEventNestedInput;
  };

  export type EventUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string;
    title?: StringFieldUpdateOperationsInput | string;
    slug?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    shortDescription?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: EnumEventStatusFieldUpdateOperationsInput | $Enums.EventStatus;
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    capacity?: NullableIntFieldUpdateOperationsInput | number | null;
    currentWaitlist?: IntFieldUpdateOperationsInput | number;
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    mapLat?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapLng?: NullableFloatFieldUpdateOperationsInput | number | null;
    mapZoom?: NullableIntFieldUpdateOperationsInput | number | null;
    mapAddress?: NullableStringFieldUpdateOperationsInput | string | null;
    ownerId?: StringFieldUpdateOperationsInput | string;
    venueId?: NullableStringFieldUpdateOperationsInput | string | null;
    isPublic?: BoolFieldUpdateOperationsInput | boolean;
    featured?: BoolFieldUpdateOperationsInput | boolean;
    tags?: EventUpdatetagsInput | string[];
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  /**
   * Aliases for legacy arg types
   */
  /**
   * @deprecated Use UserCountOutputTypeDefaultArgs instead
   */
  export type UserCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = UserCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use EventCountOutputTypeDefaultArgs instead
   */
  export type EventCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = EventCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VenueCountOutputTypeDefaultArgs instead
   */
  export type VenueCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VenueCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CategoryCountOutputTypeDefaultArgs instead
   */
  export type CategoryCountOutputTypeArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = CategoryCountOutputTypeDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use UserDefaultArgs instead
   */
  export type UserArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = UserDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use EventDefaultArgs instead
   */
  export type EventArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = EventDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use VenueDefaultArgs instead
   */
  export type VenueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = VenueDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use WaitlistEntryDefaultArgs instead
   */
  export type WaitlistEntryArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = WaitlistEntryDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use SessionDefaultArgs instead
   */
  export type SessionArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = SessionDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use AuditLogDefaultArgs instead
   */
  export type AuditLogArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = AuditLogDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ShowDefaultArgs instead
   */
  export type ShowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ShowDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use CategoryDefaultArgs instead
   */
  export type CategoryArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = CategoryDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use EmailVerificationDefaultArgs instead
   */
  export type EmailVerificationArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = EmailVerificationDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use ConsentDefaultArgs instead
   */
  export type ConsentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = ConsentDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use NearbyPlaceDefaultArgs instead
   */
  export type NearbyPlaceArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = NearbyPlaceDefaultArgs<ExtArgs>;
  /**
   * @deprecated Use InvitationDefaultArgs instead
   */
  export type InvitationArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = InvitationDefaultArgs<ExtArgs>;

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
