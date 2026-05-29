
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model OAuthAccount
 * 
 */
export type OAuthAccount = $Result.DefaultSelection<Prisma.$OAuthAccountPayload>
/**
 * Model GuestSession
 * Ephemeral session for guest bookmarks / reading history before signup (merged on register).
 */
export type GuestSession = $Result.DefaultSelection<Prisma.$GuestSessionPayload>
/**
 * Model GuestSavedArticle
 * 
 */
export type GuestSavedArticle = $Result.DefaultSelection<Prisma.$GuestSavedArticlePayload>
/**
 * Model GuestReadingHistory
 * 
 */
export type GuestReadingHistory = $Result.DefaultSelection<Prisma.$GuestReadingHistoryPayload>
/**
 * Model SavedArticle
 * 
 */
export type SavedArticle = $Result.DefaultSelection<Prisma.$SavedArticlePayload>
/**
 * Model ReadingHistory
 * 
 */
export type ReadingHistory = $Result.DefaultSelection<Prisma.$ReadingHistoryPayload>
/**
 * Model Article
 * 
 */
export type Article = $Result.DefaultSelection<Prisma.$ArticlePayload>
/**
 * Model StoryCluster
 * A real-world story covered by one or more sources. Articles from BBC,
 * France24, CNN, Al Jazeera, etc. about the same event are kept and grouped
 * here (never deduplicated away). Grouping is same-language only.
 */
export type StoryCluster = $Result.DefaultSelection<Prisma.$StoryClusterPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AppLocale: {
  en: 'en',
  fr: 'fr',
  rw: 'rw'
};

export type AppLocale = (typeof AppLocale)[keyof typeof AppLocale]


export const AuthProvider: {
  google: 'google'
};

export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider]

}

export type AppLocale = $Enums.AppLocale

export const AppLocale: typeof $Enums.AppLocale

export type AuthProvider = $Enums.AuthProvider

export const AuthProvider: typeof $Enums.AuthProvider

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oAuthAccount`: Exposes CRUD operations for the **OAuthAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OAuthAccounts
    * const oAuthAccounts = await prisma.oAuthAccount.findMany()
    * ```
    */
  get oAuthAccount(): Prisma.OAuthAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guestSession`: Exposes CRUD operations for the **GuestSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuestSessions
    * const guestSessions = await prisma.guestSession.findMany()
    * ```
    */
  get guestSession(): Prisma.GuestSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guestSavedArticle`: Exposes CRUD operations for the **GuestSavedArticle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuestSavedArticles
    * const guestSavedArticles = await prisma.guestSavedArticle.findMany()
    * ```
    */
  get guestSavedArticle(): Prisma.GuestSavedArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guestReadingHistory`: Exposes CRUD operations for the **GuestReadingHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GuestReadingHistories
    * const guestReadingHistories = await prisma.guestReadingHistory.findMany()
    * ```
    */
  get guestReadingHistory(): Prisma.GuestReadingHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.savedArticle`: Exposes CRUD operations for the **SavedArticle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SavedArticles
    * const savedArticles = await prisma.savedArticle.findMany()
    * ```
    */
  get savedArticle(): Prisma.SavedArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.readingHistory`: Exposes CRUD operations for the **ReadingHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReadingHistories
    * const readingHistories = await prisma.readingHistory.findMany()
    * ```
    */
  get readingHistory(): Prisma.ReadingHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.article`: Exposes CRUD operations for the **Article** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.article.findMany()
    * ```
    */
  get article(): Prisma.ArticleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storyCluster`: Exposes CRUD operations for the **StoryCluster** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StoryClusters
    * const storyClusters = await prisma.storyCluster.findMany()
    * ```
    */
  get storyCluster(): Prisma.StoryClusterDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

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
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
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
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    OAuthAccount: 'OAuthAccount',
    GuestSession: 'GuestSession',
    GuestSavedArticle: 'GuestSavedArticle',
    GuestReadingHistory: 'GuestReadingHistory',
    SavedArticle: 'SavedArticle',
    ReadingHistory: 'ReadingHistory',
    Article: 'Article',
    StoryCluster: 'StoryCluster'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "oAuthAccount" | "guestSession" | "guestSavedArticle" | "guestReadingHistory" | "savedArticle" | "readingHistory" | "article" | "storyCluster"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      OAuthAccount: {
        payload: Prisma.$OAuthAccountPayload<ExtArgs>
        fields: Prisma.OAuthAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OAuthAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OAuthAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          findFirst: {
            args: Prisma.OAuthAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OAuthAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          findMany: {
            args: Prisma.OAuthAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[]
          }
          create: {
            args: Prisma.OAuthAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          createMany: {
            args: Prisma.OAuthAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OAuthAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[]
          }
          delete: {
            args: Prisma.OAuthAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          update: {
            args: Prisma.OAuthAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          deleteMany: {
            args: Prisma.OAuthAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OAuthAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OAuthAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>[]
          }
          upsert: {
            args: Prisma.OAuthAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthAccountPayload>
          }
          aggregate: {
            args: Prisma.OAuthAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOAuthAccount>
          }
          groupBy: {
            args: Prisma.OAuthAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<OAuthAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.OAuthAccountCountArgs<ExtArgs>
            result: $Utils.Optional<OAuthAccountCountAggregateOutputType> | number
          }
        }
      }
      GuestSession: {
        payload: Prisma.$GuestSessionPayload<ExtArgs>
        fields: Prisma.GuestSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>
          }
          findFirst: {
            args: Prisma.GuestSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>
          }
          findMany: {
            args: Prisma.GuestSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>[]
          }
          create: {
            args: Prisma.GuestSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>
          }
          createMany: {
            args: Prisma.GuestSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuestSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>[]
          }
          delete: {
            args: Prisma.GuestSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>
          }
          update: {
            args: Prisma.GuestSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>
          }
          deleteMany: {
            args: Prisma.GuestSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuestSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>[]
          }
          upsert: {
            args: Prisma.GuestSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSessionPayload>
          }
          aggregate: {
            args: Prisma.GuestSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuestSession>
          }
          groupBy: {
            args: Prisma.GuestSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestSessionCountArgs<ExtArgs>
            result: $Utils.Optional<GuestSessionCountAggregateOutputType> | number
          }
        }
      }
      GuestSavedArticle: {
        payload: Prisma.$GuestSavedArticlePayload<ExtArgs>
        fields: Prisma.GuestSavedArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestSavedArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestSavedArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>
          }
          findFirst: {
            args: Prisma.GuestSavedArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestSavedArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>
          }
          findMany: {
            args: Prisma.GuestSavedArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>[]
          }
          create: {
            args: Prisma.GuestSavedArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>
          }
          createMany: {
            args: Prisma.GuestSavedArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuestSavedArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>[]
          }
          delete: {
            args: Prisma.GuestSavedArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>
          }
          update: {
            args: Prisma.GuestSavedArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>
          }
          deleteMany: {
            args: Prisma.GuestSavedArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestSavedArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuestSavedArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>[]
          }
          upsert: {
            args: Prisma.GuestSavedArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestSavedArticlePayload>
          }
          aggregate: {
            args: Prisma.GuestSavedArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuestSavedArticle>
          }
          groupBy: {
            args: Prisma.GuestSavedArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestSavedArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestSavedArticleCountArgs<ExtArgs>
            result: $Utils.Optional<GuestSavedArticleCountAggregateOutputType> | number
          }
        }
      }
      GuestReadingHistory: {
        payload: Prisma.$GuestReadingHistoryPayload<ExtArgs>
        fields: Prisma.GuestReadingHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuestReadingHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuestReadingHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>
          }
          findFirst: {
            args: Prisma.GuestReadingHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuestReadingHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>
          }
          findMany: {
            args: Prisma.GuestReadingHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>[]
          }
          create: {
            args: Prisma.GuestReadingHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>
          }
          createMany: {
            args: Prisma.GuestReadingHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuestReadingHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>[]
          }
          delete: {
            args: Prisma.GuestReadingHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>
          }
          update: {
            args: Prisma.GuestReadingHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>
          }
          deleteMany: {
            args: Prisma.GuestReadingHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuestReadingHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuestReadingHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>[]
          }
          upsert: {
            args: Prisma.GuestReadingHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuestReadingHistoryPayload>
          }
          aggregate: {
            args: Prisma.GuestReadingHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuestReadingHistory>
          }
          groupBy: {
            args: Prisma.GuestReadingHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuestReadingHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuestReadingHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<GuestReadingHistoryCountAggregateOutputType> | number
          }
        }
      }
      SavedArticle: {
        payload: Prisma.$SavedArticlePayload<ExtArgs>
        fields: Prisma.SavedArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SavedArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SavedArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>
          }
          findFirst: {
            args: Prisma.SavedArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SavedArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>
          }
          findMany: {
            args: Prisma.SavedArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>[]
          }
          create: {
            args: Prisma.SavedArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>
          }
          createMany: {
            args: Prisma.SavedArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SavedArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>[]
          }
          delete: {
            args: Prisma.SavedArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>
          }
          update: {
            args: Prisma.SavedArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>
          }
          deleteMany: {
            args: Prisma.SavedArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SavedArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SavedArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>[]
          }
          upsert: {
            args: Prisma.SavedArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedArticlePayload>
          }
          aggregate: {
            args: Prisma.SavedArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSavedArticle>
          }
          groupBy: {
            args: Prisma.SavedArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SavedArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SavedArticleCountArgs<ExtArgs>
            result: $Utils.Optional<SavedArticleCountAggregateOutputType> | number
          }
        }
      }
      ReadingHistory: {
        payload: Prisma.$ReadingHistoryPayload<ExtArgs>
        fields: Prisma.ReadingHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReadingHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReadingHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>
          }
          findFirst: {
            args: Prisma.ReadingHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReadingHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>
          }
          findMany: {
            args: Prisma.ReadingHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>[]
          }
          create: {
            args: Prisma.ReadingHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>
          }
          createMany: {
            args: Prisma.ReadingHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReadingHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>[]
          }
          delete: {
            args: Prisma.ReadingHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>
          }
          update: {
            args: Prisma.ReadingHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>
          }
          deleteMany: {
            args: Prisma.ReadingHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReadingHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReadingHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>[]
          }
          upsert: {
            args: Prisma.ReadingHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingHistoryPayload>
          }
          aggregate: {
            args: Prisma.ReadingHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReadingHistory>
          }
          groupBy: {
            args: Prisma.ReadingHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReadingHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReadingHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<ReadingHistoryCountAggregateOutputType> | number
          }
        }
      }
      Article: {
        payload: Prisma.$ArticlePayload<ExtArgs>
        fields: Prisma.ArticleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findFirst: {
            args: Prisma.ArticleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          findMany: {
            args: Prisma.ArticleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          create: {
            args: Prisma.ArticleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          createMany: {
            args: Prisma.ArticleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ArticleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          delete: {
            args: Prisma.ArticleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          update: {
            args: Prisma.ArticleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          deleteMany: {
            args: Prisma.ArticleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ArticleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>[]
          }
          upsert: {
            args: Prisma.ArticleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlePayload>
          }
          aggregate: {
            args: Prisma.ArticleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticle>
          }
          groupBy: {
            args: Prisma.ArticleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleCountAggregateOutputType> | number
          }
        }
      }
      StoryCluster: {
        payload: Prisma.$StoryClusterPayload<ExtArgs>
        fields: Prisma.StoryClusterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoryClusterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoryClusterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>
          }
          findFirst: {
            args: Prisma.StoryClusterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoryClusterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>
          }
          findMany: {
            args: Prisma.StoryClusterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>[]
          }
          create: {
            args: Prisma.StoryClusterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>
          }
          createMany: {
            args: Prisma.StoryClusterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoryClusterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>[]
          }
          delete: {
            args: Prisma.StoryClusterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>
          }
          update: {
            args: Prisma.StoryClusterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>
          }
          deleteMany: {
            args: Prisma.StoryClusterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoryClusterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StoryClusterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>[]
          }
          upsert: {
            args: Prisma.StoryClusterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryClusterPayload>
          }
          aggregate: {
            args: Prisma.StoryClusterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStoryCluster>
          }
          groupBy: {
            args: Prisma.StoryClusterGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoryClusterGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoryClusterCountArgs<ExtArgs>
            result: $Utils.Optional<StoryClusterCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    oAuthAccount?: OAuthAccountOmit
    guestSession?: GuestSessionOmit
    guestSavedArticle?: GuestSavedArticleOmit
    guestReadingHistory?: GuestReadingHistoryOmit
    savedArticle?: SavedArticleOmit
    readingHistory?: ReadingHistoryOmit
    article?: ArticleOmit
    storyCluster?: StoryClusterOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
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
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    savedArticles: number
    readingHistory: number
    oauthAccounts: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedArticles?: boolean | UserCountOutputTypeCountSavedArticlesArgs
    readingHistory?: boolean | UserCountOutputTypeCountReadingHistoryArgs
    oauthAccounts?: boolean | UserCountOutputTypeCountOauthAccountsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSavedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedArticleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReadingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOauthAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OAuthAccountWhereInput
  }


  /**
   * Count Type GuestSessionCountOutputType
   */

  export type GuestSessionCountOutputType = {
    savedArticles: number
    readingHistory: number
  }

  export type GuestSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedArticles?: boolean | GuestSessionCountOutputTypeCountSavedArticlesArgs
    readingHistory?: boolean | GuestSessionCountOutputTypeCountReadingHistoryArgs
  }

  // Custom InputTypes
  /**
   * GuestSessionCountOutputType without action
   */
  export type GuestSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSessionCountOutputType
     */
    select?: GuestSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GuestSessionCountOutputType without action
   */
  export type GuestSessionCountOutputTypeCountSavedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestSavedArticleWhereInput
  }

  /**
   * GuestSessionCountOutputType without action
   */
  export type GuestSessionCountOutputTypeCountReadingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestReadingHistoryWhereInput
  }


  /**
   * Count Type ArticleCountOutputType
   */

  export type ArticleCountOutputType = {
    savedBy: number
    readingHistory: number
    guestSaves: number
    guestReadingHistory: number
  }

  export type ArticleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedBy?: boolean | ArticleCountOutputTypeCountSavedByArgs
    readingHistory?: boolean | ArticleCountOutputTypeCountReadingHistoryArgs
    guestSaves?: boolean | ArticleCountOutputTypeCountGuestSavesArgs
    guestReadingHistory?: boolean | ArticleCountOutputTypeCountGuestReadingHistoryArgs
  }

  // Custom InputTypes
  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleCountOutputType
     */
    select?: ArticleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountSavedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedArticleWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountReadingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingHistoryWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountGuestSavesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestSavedArticleWhereInput
  }

  /**
   * ArticleCountOutputType without action
   */
  export type ArticleCountOutputTypeCountGuestReadingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestReadingHistoryWhereInput
  }


  /**
   * Count Type StoryClusterCountOutputType
   */

  export type StoryClusterCountOutputType = {
    articles: number
  }

  export type StoryClusterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | StoryClusterCountOutputTypeCountArticlesArgs
  }

  // Custom InputTypes
  /**
   * StoryClusterCountOutputType without action
   */
  export type StoryClusterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryClusterCountOutputType
     */
    select?: StoryClusterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoryClusterCountOutputType without action
   */
  export type StoryClusterCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatarUrl: string | null
    preferredLanguage: $Enums.AppLocale | null
    dailyDigest: boolean | null
    breakingNews: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatarUrl: string | null
    preferredLanguage: $Enums.AppLocale | null
    dailyDigest: boolean | null
    breakingNews: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    avatarUrl: number
    preferredLanguage: number
    favoriteTopics: number
    dailyDigest: number
    breakingNews: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    preferredLanguage?: true
    dailyDigest?: true
    breakingNews?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    preferredLanguage?: true
    dailyDigest?: true
    breakingNews?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    preferredLanguage?: true
    favoriteTopics?: true
    dailyDigest?: true
    breakingNews?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    name: string | null
    avatarUrl: string | null
    preferredLanguage: $Enums.AppLocale
    favoriteTopics: string[]
    dailyDigest: boolean
    breakingNews: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    preferredLanguage?: boolean
    favoriteTopics?: boolean
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    savedArticles?: boolean | User$savedArticlesArgs<ExtArgs>
    readingHistory?: boolean | User$readingHistoryArgs<ExtArgs>
    oauthAccounts?: boolean | User$oauthAccountsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    preferredLanguage?: boolean
    favoriteTopics?: boolean
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    preferredLanguage?: boolean
    favoriteTopics?: boolean
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    preferredLanguage?: boolean
    favoriteTopics?: boolean
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "avatarUrl" | "preferredLanguage" | "favoriteTopics" | "dailyDigest" | "breakingNews" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedArticles?: boolean | User$savedArticlesArgs<ExtArgs>
    readingHistory?: boolean | User$readingHistoryArgs<ExtArgs>
    oauthAccounts?: boolean | User$oauthAccountsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      savedArticles: Prisma.$SavedArticlePayload<ExtArgs>[]
      readingHistory: Prisma.$ReadingHistoryPayload<ExtArgs>[]
      oauthAccounts: Prisma.$OAuthAccountPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      /**
       * Nullable — may be absent for anonymous-origin accounts.
       */
      email: string | null
      name: string | null
      avatarUrl: string | null
      preferredLanguage: $Enums.AppLocale
      favoriteTopics: string[]
      dailyDigest: boolean
      breakingNews: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
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
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

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
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

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
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

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
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

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
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


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
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

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
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
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
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    savedArticles<T extends User$savedArticlesArgs<ExtArgs> = {}>(args?: Subset<T, User$savedArticlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    readingHistory<T extends User$readingHistoryArgs<ExtArgs> = {}>(args?: Subset<T, User$readingHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    oauthAccounts<T extends User$oauthAccountsArgs<ExtArgs> = {}>(args?: Subset<T, User$oauthAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly preferredLanguage: FieldRef<"User", 'AppLocale'>
    readonly favoriteTopics: FieldRef<"User", 'String[]'>
    readonly dailyDigest: FieldRef<"User", 'Boolean'>
    readonly breakingNews: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.savedArticles
   */
  export type User$savedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    where?: SavedArticleWhereInput
    orderBy?: SavedArticleOrderByWithRelationInput | SavedArticleOrderByWithRelationInput[]
    cursor?: SavedArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedArticleScalarFieldEnum | SavedArticleScalarFieldEnum[]
  }

  /**
   * User.readingHistory
   */
  export type User$readingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    where?: ReadingHistoryWhereInput
    orderBy?: ReadingHistoryOrderByWithRelationInput | ReadingHistoryOrderByWithRelationInput[]
    cursor?: ReadingHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingHistoryScalarFieldEnum | ReadingHistoryScalarFieldEnum[]
  }

  /**
   * User.oauthAccounts
   */
  export type User$oauthAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    where?: OAuthAccountWhereInput
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    cursor?: OAuthAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model OAuthAccount
   */

  export type AggregateOAuthAccount = {
    _count: OAuthAccountCountAggregateOutputType | null
    _min: OAuthAccountMinAggregateOutputType | null
    _max: OAuthAccountMaxAggregateOutputType | null
  }

  export type OAuthAccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: $Enums.AuthProvider | null
    providerAccountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OAuthAccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    provider: $Enums.AuthProvider | null
    providerAccountId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OAuthAccountCountAggregateOutputType = {
    id: number
    userId: number
    provider: number
    providerAccountId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OAuthAccountMinAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    providerAccountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OAuthAccountMaxAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    providerAccountId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OAuthAccountCountAggregateInputType = {
    id?: true
    userId?: true
    provider?: true
    providerAccountId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OAuthAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OAuthAccount to aggregate.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OAuthAccounts
    **/
    _count?: true | OAuthAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OAuthAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OAuthAccountMaxAggregateInputType
  }

  export type GetOAuthAccountAggregateType<T extends OAuthAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateOAuthAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOAuthAccount[P]>
      : GetScalarType<T[P], AggregateOAuthAccount[P]>
  }




  export type OAuthAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OAuthAccountWhereInput
    orderBy?: OAuthAccountOrderByWithAggregationInput | OAuthAccountOrderByWithAggregationInput[]
    by: OAuthAccountScalarFieldEnum[] | OAuthAccountScalarFieldEnum
    having?: OAuthAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OAuthAccountCountAggregateInputType | true
    _min?: OAuthAccountMinAggregateInputType
    _max?: OAuthAccountMaxAggregateInputType
  }

  export type OAuthAccountGroupByOutputType = {
    id: string
    userId: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt: Date
    updatedAt: Date
    _count: OAuthAccountCountAggregateOutputType | null
    _min: OAuthAccountMinAggregateOutputType | null
    _max: OAuthAccountMaxAggregateOutputType | null
  }

  type GetOAuthAccountGroupByPayload<T extends OAuthAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OAuthAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OAuthAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OAuthAccountGroupByOutputType[P]>
            : GetScalarType<T[P], OAuthAccountGroupByOutputType[P]>
        }
      >
    >


  export type OAuthAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    providerAccountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthAccount"]>

  export type OAuthAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    providerAccountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthAccount"]>

  export type OAuthAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    provider?: boolean
    providerAccountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthAccount"]>

  export type OAuthAccountSelectScalar = {
    id?: boolean
    userId?: boolean
    provider?: boolean
    providerAccountId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OAuthAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "provider" | "providerAccountId" | "createdAt" | "updatedAt", ExtArgs["result"]["oAuthAccount"]>
  export type OAuthAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OAuthAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OAuthAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OAuthAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OAuthAccount"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      provider: $Enums.AuthProvider
      providerAccountId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oAuthAccount"]>
    composites: {}
  }

  type OAuthAccountGetPayload<S extends boolean | null | undefined | OAuthAccountDefaultArgs> = $Result.GetResult<Prisma.$OAuthAccountPayload, S>

  type OAuthAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OAuthAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OAuthAccountCountAggregateInputType | true
    }

  export interface OAuthAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OAuthAccount'], meta: { name: 'OAuthAccount' } }
    /**
     * Find zero or one OAuthAccount that matches the filter.
     * @param {OAuthAccountFindUniqueArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OAuthAccountFindUniqueArgs>(args: SelectSubset<T, OAuthAccountFindUniqueArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OAuthAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OAuthAccountFindUniqueOrThrowArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OAuthAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, OAuthAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuthAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountFindFirstArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OAuthAccountFindFirstArgs>(args?: SelectSubset<T, OAuthAccountFindFirstArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuthAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountFindFirstOrThrowArgs} args - Arguments to find a OAuthAccount
     * @example
     * // Get one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OAuthAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, OAuthAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OAuthAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OAuthAccounts
     * const oAuthAccounts = await prisma.oAuthAccount.findMany()
     * 
     * // Get first 10 OAuthAccounts
     * const oAuthAccounts = await prisma.oAuthAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oAuthAccountWithIdOnly = await prisma.oAuthAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OAuthAccountFindManyArgs>(args?: SelectSubset<T, OAuthAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OAuthAccount.
     * @param {OAuthAccountCreateArgs} args - Arguments to create a OAuthAccount.
     * @example
     * // Create one OAuthAccount
     * const OAuthAccount = await prisma.oAuthAccount.create({
     *   data: {
     *     // ... data to create a OAuthAccount
     *   }
     * })
     * 
     */
    create<T extends OAuthAccountCreateArgs>(args: SelectSubset<T, OAuthAccountCreateArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OAuthAccounts.
     * @param {OAuthAccountCreateManyArgs} args - Arguments to create many OAuthAccounts.
     * @example
     * // Create many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OAuthAccountCreateManyArgs>(args?: SelectSubset<T, OAuthAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OAuthAccounts and returns the data saved in the database.
     * @param {OAuthAccountCreateManyAndReturnArgs} args - Arguments to create many OAuthAccounts.
     * @example
     * // Create many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OAuthAccounts and only return the `id`
     * const oAuthAccountWithIdOnly = await prisma.oAuthAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OAuthAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, OAuthAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OAuthAccount.
     * @param {OAuthAccountDeleteArgs} args - Arguments to delete one OAuthAccount.
     * @example
     * // Delete one OAuthAccount
     * const OAuthAccount = await prisma.oAuthAccount.delete({
     *   where: {
     *     // ... filter to delete one OAuthAccount
     *   }
     * })
     * 
     */
    delete<T extends OAuthAccountDeleteArgs>(args: SelectSubset<T, OAuthAccountDeleteArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OAuthAccount.
     * @param {OAuthAccountUpdateArgs} args - Arguments to update one OAuthAccount.
     * @example
     * // Update one OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OAuthAccountUpdateArgs>(args: SelectSubset<T, OAuthAccountUpdateArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OAuthAccounts.
     * @param {OAuthAccountDeleteManyArgs} args - Arguments to filter OAuthAccounts to delete.
     * @example
     * // Delete a few OAuthAccounts
     * const { count } = await prisma.oAuthAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OAuthAccountDeleteManyArgs>(args?: SelectSubset<T, OAuthAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuthAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OAuthAccountUpdateManyArgs>(args: SelectSubset<T, OAuthAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuthAccounts and returns the data updated in the database.
     * @param {OAuthAccountUpdateManyAndReturnArgs} args - Arguments to update many OAuthAccounts.
     * @example
     * // Update many OAuthAccounts
     * const oAuthAccount = await prisma.oAuthAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OAuthAccounts and only return the `id`
     * const oAuthAccountWithIdOnly = await prisma.oAuthAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OAuthAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, OAuthAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OAuthAccount.
     * @param {OAuthAccountUpsertArgs} args - Arguments to update or create a OAuthAccount.
     * @example
     * // Update or create a OAuthAccount
     * const oAuthAccount = await prisma.oAuthAccount.upsert({
     *   create: {
     *     // ... data to create a OAuthAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OAuthAccount we want to update
     *   }
     * })
     */
    upsert<T extends OAuthAccountUpsertArgs>(args: SelectSubset<T, OAuthAccountUpsertArgs<ExtArgs>>): Prisma__OAuthAccountClient<$Result.GetResult<Prisma.$OAuthAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OAuthAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountCountArgs} args - Arguments to filter OAuthAccounts to count.
     * @example
     * // Count the number of OAuthAccounts
     * const count = await prisma.oAuthAccount.count({
     *   where: {
     *     // ... the filter for the OAuthAccounts we want to count
     *   }
     * })
    **/
    count<T extends OAuthAccountCountArgs>(
      args?: Subset<T, OAuthAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OAuthAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OAuthAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OAuthAccountAggregateArgs>(args: Subset<T, OAuthAccountAggregateArgs>): Prisma.PrismaPromise<GetOAuthAccountAggregateType<T>>

    /**
     * Group by OAuthAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthAccountGroupByArgs} args - Group by arguments.
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
      T extends OAuthAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OAuthAccountGroupByArgs['orderBy'] }
        : { orderBy?: OAuthAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OAuthAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOAuthAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OAuthAccount model
   */
  readonly fields: OAuthAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OAuthAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OAuthAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OAuthAccount model
   */
  interface OAuthAccountFieldRefs {
    readonly id: FieldRef<"OAuthAccount", 'String'>
    readonly userId: FieldRef<"OAuthAccount", 'String'>
    readonly provider: FieldRef<"OAuthAccount", 'AuthProvider'>
    readonly providerAccountId: FieldRef<"OAuthAccount", 'String'>
    readonly createdAt: FieldRef<"OAuthAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"OAuthAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OAuthAccount findUnique
   */
  export type OAuthAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount findUniqueOrThrow
   */
  export type OAuthAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount findFirst
   */
  export type OAuthAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OAuthAccounts.
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthAccounts.
     */
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * OAuthAccount findFirstOrThrow
   */
  export type OAuthAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccount to fetch.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OAuthAccounts.
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthAccounts.
     */
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * OAuthAccount findMany
   */
  export type OAuthAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthAccounts to fetch.
     */
    where?: OAuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthAccounts to fetch.
     */
    orderBy?: OAuthAccountOrderByWithRelationInput | OAuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OAuthAccounts.
     */
    cursor?: OAuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthAccounts.
     */
    distinct?: OAuthAccountScalarFieldEnum | OAuthAccountScalarFieldEnum[]
  }

  /**
   * OAuthAccount create
   */
  export type OAuthAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a OAuthAccount.
     */
    data: XOR<OAuthAccountCreateInput, OAuthAccountUncheckedCreateInput>
  }

  /**
   * OAuthAccount createMany
   */
  export type OAuthAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OAuthAccounts.
     */
    data: OAuthAccountCreateManyInput | OAuthAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OAuthAccount createManyAndReturn
   */
  export type OAuthAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * The data used to create many OAuthAccounts.
     */
    data: OAuthAccountCreateManyInput | OAuthAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OAuthAccount update
   */
  export type OAuthAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a OAuthAccount.
     */
    data: XOR<OAuthAccountUpdateInput, OAuthAccountUncheckedUpdateInput>
    /**
     * Choose, which OAuthAccount to update.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount updateMany
   */
  export type OAuthAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OAuthAccounts.
     */
    data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyInput>
    /**
     * Filter which OAuthAccounts to update
     */
    where?: OAuthAccountWhereInput
    /**
     * Limit how many OAuthAccounts to update.
     */
    limit?: number
  }

  /**
   * OAuthAccount updateManyAndReturn
   */
  export type OAuthAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * The data used to update OAuthAccounts.
     */
    data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyInput>
    /**
     * Filter which OAuthAccounts to update
     */
    where?: OAuthAccountWhereInput
    /**
     * Limit how many OAuthAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OAuthAccount upsert
   */
  export type OAuthAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the OAuthAccount to update in case it exists.
     */
    where: OAuthAccountWhereUniqueInput
    /**
     * In case the OAuthAccount found by the `where` argument doesn't exist, create a new OAuthAccount with this data.
     */
    create: XOR<OAuthAccountCreateInput, OAuthAccountUncheckedCreateInput>
    /**
     * In case the OAuthAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OAuthAccountUpdateInput, OAuthAccountUncheckedUpdateInput>
  }

  /**
   * OAuthAccount delete
   */
  export type OAuthAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
    /**
     * Filter which OAuthAccount to delete.
     */
    where: OAuthAccountWhereUniqueInput
  }

  /**
   * OAuthAccount deleteMany
   */
  export type OAuthAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OAuthAccounts to delete
     */
    where?: OAuthAccountWhereInput
    /**
     * Limit how many OAuthAccounts to delete.
     */
    limit?: number
  }

  /**
   * OAuthAccount without action
   */
  export type OAuthAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthAccount
     */
    select?: OAuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthAccount
     */
    omit?: OAuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthAccountInclude<ExtArgs> | null
  }


  /**
   * Model GuestSession
   */

  export type AggregateGuestSession = {
    _count: GuestSessionCountAggregateOutputType | null
    _min: GuestSessionMinAggregateOutputType | null
    _max: GuestSessionMaxAggregateOutputType | null
  }

  export type GuestSessionMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type GuestSessionMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type GuestSessionCountAggregateOutputType = {
    id: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type GuestSessionMinAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
  }

  export type GuestSessionMaxAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
  }

  export type GuestSessionCountAggregateInputType = {
    id?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type GuestSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestSession to aggregate.
     */
    where?: GuestSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSessions to fetch.
     */
    orderBy?: GuestSessionOrderByWithRelationInput | GuestSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuestSessions
    **/
    _count?: true | GuestSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestSessionMaxAggregateInputType
  }

  export type GetGuestSessionAggregateType<T extends GuestSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateGuestSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuestSession[P]>
      : GetScalarType<T[P], AggregateGuestSession[P]>
  }




  export type GuestSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestSessionWhereInput
    orderBy?: GuestSessionOrderByWithAggregationInput | GuestSessionOrderByWithAggregationInput[]
    by: GuestSessionScalarFieldEnum[] | GuestSessionScalarFieldEnum
    having?: GuestSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestSessionCountAggregateInputType | true
    _min?: GuestSessionMinAggregateInputType
    _max?: GuestSessionMaxAggregateInputType
  }

  export type GuestSessionGroupByOutputType = {
    id: string
    createdAt: Date
    expiresAt: Date | null
    _count: GuestSessionCountAggregateOutputType | null
    _min: GuestSessionMinAggregateOutputType | null
    _max: GuestSessionMaxAggregateOutputType | null
  }

  type GetGuestSessionGroupByPayload<T extends GuestSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestSessionGroupByOutputType[P]>
            : GetScalarType<T[P], GuestSessionGroupByOutputType[P]>
        }
      >
    >


  export type GuestSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    savedArticles?: boolean | GuestSession$savedArticlesArgs<ExtArgs>
    readingHistory?: boolean | GuestSession$readingHistoryArgs<ExtArgs>
    _count?: boolean | GuestSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestSession"]>

  export type GuestSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["guestSession"]>

  export type GuestSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["guestSession"]>

  export type GuestSessionSelectScalar = {
    id?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type GuestSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "expiresAt", ExtArgs["result"]["guestSession"]>
  export type GuestSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    savedArticles?: boolean | GuestSession$savedArticlesArgs<ExtArgs>
    readingHistory?: boolean | GuestSession$readingHistoryArgs<ExtArgs>
    _count?: boolean | GuestSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GuestSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GuestSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GuestSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuestSession"
    objects: {
      savedArticles: Prisma.$GuestSavedArticlePayload<ExtArgs>[]
      readingHistory: Prisma.$GuestReadingHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["guestSession"]>
    composites: {}
  }

  type GuestSessionGetPayload<S extends boolean | null | undefined | GuestSessionDefaultArgs> = $Result.GetResult<Prisma.$GuestSessionPayload, S>

  type GuestSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuestSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuestSessionCountAggregateInputType | true
    }

  export interface GuestSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuestSession'], meta: { name: 'GuestSession' } }
    /**
     * Find zero or one GuestSession that matches the filter.
     * @param {GuestSessionFindUniqueArgs} args - Arguments to find a GuestSession
     * @example
     * // Get one GuestSession
     * const guestSession = await prisma.guestSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestSessionFindUniqueArgs>(args: SelectSubset<T, GuestSessionFindUniqueArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuestSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuestSessionFindUniqueOrThrowArgs} args - Arguments to find a GuestSession
     * @example
     * // Get one GuestSession
     * const guestSession = await prisma.guestSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuestSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionFindFirstArgs} args - Arguments to find a GuestSession
     * @example
     * // Get one GuestSession
     * const guestSession = await prisma.guestSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestSessionFindFirstArgs>(args?: SelectSubset<T, GuestSessionFindFirstArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuestSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionFindFirstOrThrowArgs} args - Arguments to find a GuestSession
     * @example
     * // Get one GuestSession
     * const guestSession = await prisma.guestSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuestSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuestSessions
     * const guestSessions = await prisma.guestSession.findMany()
     * 
     * // Get first 10 GuestSessions
     * const guestSessions = await prisma.guestSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestSessionWithIdOnly = await prisma.guestSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestSessionFindManyArgs>(args?: SelectSubset<T, GuestSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuestSession.
     * @param {GuestSessionCreateArgs} args - Arguments to create a GuestSession.
     * @example
     * // Create one GuestSession
     * const GuestSession = await prisma.guestSession.create({
     *   data: {
     *     // ... data to create a GuestSession
     *   }
     * })
     * 
     */
    create<T extends GuestSessionCreateArgs>(args: SelectSubset<T, GuestSessionCreateArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuestSessions.
     * @param {GuestSessionCreateManyArgs} args - Arguments to create many GuestSessions.
     * @example
     * // Create many GuestSessions
     * const guestSession = await prisma.guestSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestSessionCreateManyArgs>(args?: SelectSubset<T, GuestSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuestSessions and returns the data saved in the database.
     * @param {GuestSessionCreateManyAndReturnArgs} args - Arguments to create many GuestSessions.
     * @example
     * // Create many GuestSessions
     * const guestSession = await prisma.guestSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuestSessions and only return the `id`
     * const guestSessionWithIdOnly = await prisma.guestSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuestSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, GuestSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuestSession.
     * @param {GuestSessionDeleteArgs} args - Arguments to delete one GuestSession.
     * @example
     * // Delete one GuestSession
     * const GuestSession = await prisma.guestSession.delete({
     *   where: {
     *     // ... filter to delete one GuestSession
     *   }
     * })
     * 
     */
    delete<T extends GuestSessionDeleteArgs>(args: SelectSubset<T, GuestSessionDeleteArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuestSession.
     * @param {GuestSessionUpdateArgs} args - Arguments to update one GuestSession.
     * @example
     * // Update one GuestSession
     * const guestSession = await prisma.guestSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestSessionUpdateArgs>(args: SelectSubset<T, GuestSessionUpdateArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuestSessions.
     * @param {GuestSessionDeleteManyArgs} args - Arguments to filter GuestSessions to delete.
     * @example
     * // Delete a few GuestSessions
     * const { count } = await prisma.guestSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestSessionDeleteManyArgs>(args?: SelectSubset<T, GuestSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuestSessions
     * const guestSession = await prisma.guestSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestSessionUpdateManyArgs>(args: SelectSubset<T, GuestSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestSessions and returns the data updated in the database.
     * @param {GuestSessionUpdateManyAndReturnArgs} args - Arguments to update many GuestSessions.
     * @example
     * // Update many GuestSessions
     * const guestSession = await prisma.guestSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuestSessions and only return the `id`
     * const guestSessionWithIdOnly = await prisma.guestSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuestSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, GuestSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuestSession.
     * @param {GuestSessionUpsertArgs} args - Arguments to update or create a GuestSession.
     * @example
     * // Update or create a GuestSession
     * const guestSession = await prisma.guestSession.upsert({
     *   create: {
     *     // ... data to create a GuestSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuestSession we want to update
     *   }
     * })
     */
    upsert<T extends GuestSessionUpsertArgs>(args: SelectSubset<T, GuestSessionUpsertArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuestSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionCountArgs} args - Arguments to filter GuestSessions to count.
     * @example
     * // Count the number of GuestSessions
     * const count = await prisma.guestSession.count({
     *   where: {
     *     // ... the filter for the GuestSessions we want to count
     *   }
     * })
    **/
    count<T extends GuestSessionCountArgs>(
      args?: Subset<T, GuestSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuestSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuestSessionAggregateArgs>(args: Subset<T, GuestSessionAggregateArgs>): Prisma.PrismaPromise<GetGuestSessionAggregateType<T>>

    /**
     * Group by GuestSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSessionGroupByArgs} args - Group by arguments.
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
      T extends GuestSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestSessionGroupByArgs['orderBy'] }
        : { orderBy?: GuestSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuestSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuestSession model
   */
  readonly fields: GuestSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuestSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    savedArticles<T extends GuestSession$savedArticlesArgs<ExtArgs> = {}>(args?: Subset<T, GuestSession$savedArticlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    readingHistory<T extends GuestSession$readingHistoryArgs<ExtArgs> = {}>(args?: Subset<T, GuestSession$readingHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuestSession model
   */
  interface GuestSessionFieldRefs {
    readonly id: FieldRef<"GuestSession", 'String'>
    readonly createdAt: FieldRef<"GuestSession", 'DateTime'>
    readonly expiresAt: FieldRef<"GuestSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuestSession findUnique
   */
  export type GuestSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * Filter, which GuestSession to fetch.
     */
    where: GuestSessionWhereUniqueInput
  }

  /**
   * GuestSession findUniqueOrThrow
   */
  export type GuestSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * Filter, which GuestSession to fetch.
     */
    where: GuestSessionWhereUniqueInput
  }

  /**
   * GuestSession findFirst
   */
  export type GuestSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * Filter, which GuestSession to fetch.
     */
    where?: GuestSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSessions to fetch.
     */
    orderBy?: GuestSessionOrderByWithRelationInput | GuestSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestSessions.
     */
    cursor?: GuestSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestSessions.
     */
    distinct?: GuestSessionScalarFieldEnum | GuestSessionScalarFieldEnum[]
  }

  /**
   * GuestSession findFirstOrThrow
   */
  export type GuestSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * Filter, which GuestSession to fetch.
     */
    where?: GuestSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSessions to fetch.
     */
    orderBy?: GuestSessionOrderByWithRelationInput | GuestSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestSessions.
     */
    cursor?: GuestSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestSessions.
     */
    distinct?: GuestSessionScalarFieldEnum | GuestSessionScalarFieldEnum[]
  }

  /**
   * GuestSession findMany
   */
  export type GuestSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * Filter, which GuestSessions to fetch.
     */
    where?: GuestSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSessions to fetch.
     */
    orderBy?: GuestSessionOrderByWithRelationInput | GuestSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuestSessions.
     */
    cursor?: GuestSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestSessions.
     */
    distinct?: GuestSessionScalarFieldEnum | GuestSessionScalarFieldEnum[]
  }

  /**
   * GuestSession create
   */
  export type GuestSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a GuestSession.
     */
    data?: XOR<GuestSessionCreateInput, GuestSessionUncheckedCreateInput>
  }

  /**
   * GuestSession createMany
   */
  export type GuestSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuestSessions.
     */
    data: GuestSessionCreateManyInput | GuestSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestSession createManyAndReturn
   */
  export type GuestSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * The data used to create many GuestSessions.
     */
    data: GuestSessionCreateManyInput | GuestSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestSession update
   */
  export type GuestSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a GuestSession.
     */
    data: XOR<GuestSessionUpdateInput, GuestSessionUncheckedUpdateInput>
    /**
     * Choose, which GuestSession to update.
     */
    where: GuestSessionWhereUniqueInput
  }

  /**
   * GuestSession updateMany
   */
  export type GuestSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuestSessions.
     */
    data: XOR<GuestSessionUpdateManyMutationInput, GuestSessionUncheckedUpdateManyInput>
    /**
     * Filter which GuestSessions to update
     */
    where?: GuestSessionWhereInput
    /**
     * Limit how many GuestSessions to update.
     */
    limit?: number
  }

  /**
   * GuestSession updateManyAndReturn
   */
  export type GuestSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * The data used to update GuestSessions.
     */
    data: XOR<GuestSessionUpdateManyMutationInput, GuestSessionUncheckedUpdateManyInput>
    /**
     * Filter which GuestSessions to update
     */
    where?: GuestSessionWhereInput
    /**
     * Limit how many GuestSessions to update.
     */
    limit?: number
  }

  /**
   * GuestSession upsert
   */
  export type GuestSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the GuestSession to update in case it exists.
     */
    where: GuestSessionWhereUniqueInput
    /**
     * In case the GuestSession found by the `where` argument doesn't exist, create a new GuestSession with this data.
     */
    create: XOR<GuestSessionCreateInput, GuestSessionUncheckedCreateInput>
    /**
     * In case the GuestSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestSessionUpdateInput, GuestSessionUncheckedUpdateInput>
  }

  /**
   * GuestSession delete
   */
  export type GuestSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
    /**
     * Filter which GuestSession to delete.
     */
    where: GuestSessionWhereUniqueInput
  }

  /**
   * GuestSession deleteMany
   */
  export type GuestSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestSessions to delete
     */
    where?: GuestSessionWhereInput
    /**
     * Limit how many GuestSessions to delete.
     */
    limit?: number
  }

  /**
   * GuestSession.savedArticles
   */
  export type GuestSession$savedArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    where?: GuestSavedArticleWhereInput
    orderBy?: GuestSavedArticleOrderByWithRelationInput | GuestSavedArticleOrderByWithRelationInput[]
    cursor?: GuestSavedArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuestSavedArticleScalarFieldEnum | GuestSavedArticleScalarFieldEnum[]
  }

  /**
   * GuestSession.readingHistory
   */
  export type GuestSession$readingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    where?: GuestReadingHistoryWhereInput
    orderBy?: GuestReadingHistoryOrderByWithRelationInput | GuestReadingHistoryOrderByWithRelationInput[]
    cursor?: GuestReadingHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuestReadingHistoryScalarFieldEnum | GuestReadingHistoryScalarFieldEnum[]
  }

  /**
   * GuestSession without action
   */
  export type GuestSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSession
     */
    select?: GuestSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSession
     */
    omit?: GuestSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSessionInclude<ExtArgs> | null
  }


  /**
   * Model GuestSavedArticle
   */

  export type AggregateGuestSavedArticle = {
    _count: GuestSavedArticleCountAggregateOutputType | null
    _min: GuestSavedArticleMinAggregateOutputType | null
    _max: GuestSavedArticleMaxAggregateOutputType | null
  }

  export type GuestSavedArticleMinAggregateOutputType = {
    id: string | null
    guestSessionId: string | null
    articleId: string | null
    savedAt: Date | null
  }

  export type GuestSavedArticleMaxAggregateOutputType = {
    id: string | null
    guestSessionId: string | null
    articleId: string | null
    savedAt: Date | null
  }

  export type GuestSavedArticleCountAggregateOutputType = {
    id: number
    guestSessionId: number
    articleId: number
    savedAt: number
    _all: number
  }


  export type GuestSavedArticleMinAggregateInputType = {
    id?: true
    guestSessionId?: true
    articleId?: true
    savedAt?: true
  }

  export type GuestSavedArticleMaxAggregateInputType = {
    id?: true
    guestSessionId?: true
    articleId?: true
    savedAt?: true
  }

  export type GuestSavedArticleCountAggregateInputType = {
    id?: true
    guestSessionId?: true
    articleId?: true
    savedAt?: true
    _all?: true
  }

  export type GuestSavedArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestSavedArticle to aggregate.
     */
    where?: GuestSavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSavedArticles to fetch.
     */
    orderBy?: GuestSavedArticleOrderByWithRelationInput | GuestSavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestSavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuestSavedArticles
    **/
    _count?: true | GuestSavedArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestSavedArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestSavedArticleMaxAggregateInputType
  }

  export type GetGuestSavedArticleAggregateType<T extends GuestSavedArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateGuestSavedArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuestSavedArticle[P]>
      : GetScalarType<T[P], AggregateGuestSavedArticle[P]>
  }




  export type GuestSavedArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestSavedArticleWhereInput
    orderBy?: GuestSavedArticleOrderByWithAggregationInput | GuestSavedArticleOrderByWithAggregationInput[]
    by: GuestSavedArticleScalarFieldEnum[] | GuestSavedArticleScalarFieldEnum
    having?: GuestSavedArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestSavedArticleCountAggregateInputType | true
    _min?: GuestSavedArticleMinAggregateInputType
    _max?: GuestSavedArticleMaxAggregateInputType
  }

  export type GuestSavedArticleGroupByOutputType = {
    id: string
    guestSessionId: string
    articleId: string
    savedAt: Date
    _count: GuestSavedArticleCountAggregateOutputType | null
    _min: GuestSavedArticleMinAggregateOutputType | null
    _max: GuestSavedArticleMaxAggregateOutputType | null
  }

  type GetGuestSavedArticleGroupByPayload<T extends GuestSavedArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestSavedArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestSavedArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestSavedArticleGroupByOutputType[P]>
            : GetScalarType<T[P], GuestSavedArticleGroupByOutputType[P]>
        }
      >
    >


  export type GuestSavedArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    savedAt?: boolean
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestSavedArticle"]>

  export type GuestSavedArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    savedAt?: boolean
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestSavedArticle"]>

  export type GuestSavedArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    savedAt?: boolean
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestSavedArticle"]>

  export type GuestSavedArticleSelectScalar = {
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    savedAt?: boolean
  }

  export type GuestSavedArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guestSessionId" | "articleId" | "savedAt", ExtArgs["result"]["guestSavedArticle"]>
  export type GuestSavedArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type GuestSavedArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type GuestSavedArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $GuestSavedArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuestSavedArticle"
    objects: {
      session: Prisma.$GuestSessionPayload<ExtArgs>
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guestSessionId: string
      articleId: string
      savedAt: Date
    }, ExtArgs["result"]["guestSavedArticle"]>
    composites: {}
  }

  type GuestSavedArticleGetPayload<S extends boolean | null | undefined | GuestSavedArticleDefaultArgs> = $Result.GetResult<Prisma.$GuestSavedArticlePayload, S>

  type GuestSavedArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuestSavedArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuestSavedArticleCountAggregateInputType | true
    }

  export interface GuestSavedArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuestSavedArticle'], meta: { name: 'GuestSavedArticle' } }
    /**
     * Find zero or one GuestSavedArticle that matches the filter.
     * @param {GuestSavedArticleFindUniqueArgs} args - Arguments to find a GuestSavedArticle
     * @example
     * // Get one GuestSavedArticle
     * const guestSavedArticle = await prisma.guestSavedArticle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestSavedArticleFindUniqueArgs>(args: SelectSubset<T, GuestSavedArticleFindUniqueArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuestSavedArticle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuestSavedArticleFindUniqueOrThrowArgs} args - Arguments to find a GuestSavedArticle
     * @example
     * // Get one GuestSavedArticle
     * const guestSavedArticle = await prisma.guestSavedArticle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestSavedArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestSavedArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuestSavedArticle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleFindFirstArgs} args - Arguments to find a GuestSavedArticle
     * @example
     * // Get one GuestSavedArticle
     * const guestSavedArticle = await prisma.guestSavedArticle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestSavedArticleFindFirstArgs>(args?: SelectSubset<T, GuestSavedArticleFindFirstArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuestSavedArticle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleFindFirstOrThrowArgs} args - Arguments to find a GuestSavedArticle
     * @example
     * // Get one GuestSavedArticle
     * const guestSavedArticle = await prisma.guestSavedArticle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestSavedArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestSavedArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuestSavedArticles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuestSavedArticles
     * const guestSavedArticles = await prisma.guestSavedArticle.findMany()
     * 
     * // Get first 10 GuestSavedArticles
     * const guestSavedArticles = await prisma.guestSavedArticle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestSavedArticleWithIdOnly = await prisma.guestSavedArticle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestSavedArticleFindManyArgs>(args?: SelectSubset<T, GuestSavedArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuestSavedArticle.
     * @param {GuestSavedArticleCreateArgs} args - Arguments to create a GuestSavedArticle.
     * @example
     * // Create one GuestSavedArticle
     * const GuestSavedArticle = await prisma.guestSavedArticle.create({
     *   data: {
     *     // ... data to create a GuestSavedArticle
     *   }
     * })
     * 
     */
    create<T extends GuestSavedArticleCreateArgs>(args: SelectSubset<T, GuestSavedArticleCreateArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuestSavedArticles.
     * @param {GuestSavedArticleCreateManyArgs} args - Arguments to create many GuestSavedArticles.
     * @example
     * // Create many GuestSavedArticles
     * const guestSavedArticle = await prisma.guestSavedArticle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestSavedArticleCreateManyArgs>(args?: SelectSubset<T, GuestSavedArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuestSavedArticles and returns the data saved in the database.
     * @param {GuestSavedArticleCreateManyAndReturnArgs} args - Arguments to create many GuestSavedArticles.
     * @example
     * // Create many GuestSavedArticles
     * const guestSavedArticle = await prisma.guestSavedArticle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuestSavedArticles and only return the `id`
     * const guestSavedArticleWithIdOnly = await prisma.guestSavedArticle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuestSavedArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, GuestSavedArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuestSavedArticle.
     * @param {GuestSavedArticleDeleteArgs} args - Arguments to delete one GuestSavedArticle.
     * @example
     * // Delete one GuestSavedArticle
     * const GuestSavedArticle = await prisma.guestSavedArticle.delete({
     *   where: {
     *     // ... filter to delete one GuestSavedArticle
     *   }
     * })
     * 
     */
    delete<T extends GuestSavedArticleDeleteArgs>(args: SelectSubset<T, GuestSavedArticleDeleteArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuestSavedArticle.
     * @param {GuestSavedArticleUpdateArgs} args - Arguments to update one GuestSavedArticle.
     * @example
     * // Update one GuestSavedArticle
     * const guestSavedArticle = await prisma.guestSavedArticle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestSavedArticleUpdateArgs>(args: SelectSubset<T, GuestSavedArticleUpdateArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuestSavedArticles.
     * @param {GuestSavedArticleDeleteManyArgs} args - Arguments to filter GuestSavedArticles to delete.
     * @example
     * // Delete a few GuestSavedArticles
     * const { count } = await prisma.guestSavedArticle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestSavedArticleDeleteManyArgs>(args?: SelectSubset<T, GuestSavedArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestSavedArticles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuestSavedArticles
     * const guestSavedArticle = await prisma.guestSavedArticle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestSavedArticleUpdateManyArgs>(args: SelectSubset<T, GuestSavedArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestSavedArticles and returns the data updated in the database.
     * @param {GuestSavedArticleUpdateManyAndReturnArgs} args - Arguments to update many GuestSavedArticles.
     * @example
     * // Update many GuestSavedArticles
     * const guestSavedArticle = await prisma.guestSavedArticle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuestSavedArticles and only return the `id`
     * const guestSavedArticleWithIdOnly = await prisma.guestSavedArticle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuestSavedArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, GuestSavedArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuestSavedArticle.
     * @param {GuestSavedArticleUpsertArgs} args - Arguments to update or create a GuestSavedArticle.
     * @example
     * // Update or create a GuestSavedArticle
     * const guestSavedArticle = await prisma.guestSavedArticle.upsert({
     *   create: {
     *     // ... data to create a GuestSavedArticle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuestSavedArticle we want to update
     *   }
     * })
     */
    upsert<T extends GuestSavedArticleUpsertArgs>(args: SelectSubset<T, GuestSavedArticleUpsertArgs<ExtArgs>>): Prisma__GuestSavedArticleClient<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuestSavedArticles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleCountArgs} args - Arguments to filter GuestSavedArticles to count.
     * @example
     * // Count the number of GuestSavedArticles
     * const count = await prisma.guestSavedArticle.count({
     *   where: {
     *     // ... the filter for the GuestSavedArticles we want to count
     *   }
     * })
    **/
    count<T extends GuestSavedArticleCountArgs>(
      args?: Subset<T, GuestSavedArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestSavedArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuestSavedArticle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuestSavedArticleAggregateArgs>(args: Subset<T, GuestSavedArticleAggregateArgs>): Prisma.PrismaPromise<GetGuestSavedArticleAggregateType<T>>

    /**
     * Group by GuestSavedArticle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestSavedArticleGroupByArgs} args - Group by arguments.
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
      T extends GuestSavedArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestSavedArticleGroupByArgs['orderBy'] }
        : { orderBy?: GuestSavedArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuestSavedArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestSavedArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuestSavedArticle model
   */
  readonly fields: GuestSavedArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuestSavedArticle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestSavedArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends GuestSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuestSessionDefaultArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuestSavedArticle model
   */
  interface GuestSavedArticleFieldRefs {
    readonly id: FieldRef<"GuestSavedArticle", 'String'>
    readonly guestSessionId: FieldRef<"GuestSavedArticle", 'String'>
    readonly articleId: FieldRef<"GuestSavedArticle", 'String'>
    readonly savedAt: FieldRef<"GuestSavedArticle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuestSavedArticle findUnique
   */
  export type GuestSavedArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which GuestSavedArticle to fetch.
     */
    where: GuestSavedArticleWhereUniqueInput
  }

  /**
   * GuestSavedArticle findUniqueOrThrow
   */
  export type GuestSavedArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which GuestSavedArticle to fetch.
     */
    where: GuestSavedArticleWhereUniqueInput
  }

  /**
   * GuestSavedArticle findFirst
   */
  export type GuestSavedArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which GuestSavedArticle to fetch.
     */
    where?: GuestSavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSavedArticles to fetch.
     */
    orderBy?: GuestSavedArticleOrderByWithRelationInput | GuestSavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestSavedArticles.
     */
    cursor?: GuestSavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestSavedArticles.
     */
    distinct?: GuestSavedArticleScalarFieldEnum | GuestSavedArticleScalarFieldEnum[]
  }

  /**
   * GuestSavedArticle findFirstOrThrow
   */
  export type GuestSavedArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which GuestSavedArticle to fetch.
     */
    where?: GuestSavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSavedArticles to fetch.
     */
    orderBy?: GuestSavedArticleOrderByWithRelationInput | GuestSavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestSavedArticles.
     */
    cursor?: GuestSavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestSavedArticles.
     */
    distinct?: GuestSavedArticleScalarFieldEnum | GuestSavedArticleScalarFieldEnum[]
  }

  /**
   * GuestSavedArticle findMany
   */
  export type GuestSavedArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which GuestSavedArticles to fetch.
     */
    where?: GuestSavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestSavedArticles to fetch.
     */
    orderBy?: GuestSavedArticleOrderByWithRelationInput | GuestSavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuestSavedArticles.
     */
    cursor?: GuestSavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestSavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestSavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestSavedArticles.
     */
    distinct?: GuestSavedArticleScalarFieldEnum | GuestSavedArticleScalarFieldEnum[]
  }

  /**
   * GuestSavedArticle create
   */
  export type GuestSavedArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a GuestSavedArticle.
     */
    data: XOR<GuestSavedArticleCreateInput, GuestSavedArticleUncheckedCreateInput>
  }

  /**
   * GuestSavedArticle createMany
   */
  export type GuestSavedArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuestSavedArticles.
     */
    data: GuestSavedArticleCreateManyInput | GuestSavedArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestSavedArticle createManyAndReturn
   */
  export type GuestSavedArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * The data used to create many GuestSavedArticles.
     */
    data: GuestSavedArticleCreateManyInput | GuestSavedArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuestSavedArticle update
   */
  export type GuestSavedArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a GuestSavedArticle.
     */
    data: XOR<GuestSavedArticleUpdateInput, GuestSavedArticleUncheckedUpdateInput>
    /**
     * Choose, which GuestSavedArticle to update.
     */
    where: GuestSavedArticleWhereUniqueInput
  }

  /**
   * GuestSavedArticle updateMany
   */
  export type GuestSavedArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuestSavedArticles.
     */
    data: XOR<GuestSavedArticleUpdateManyMutationInput, GuestSavedArticleUncheckedUpdateManyInput>
    /**
     * Filter which GuestSavedArticles to update
     */
    where?: GuestSavedArticleWhereInput
    /**
     * Limit how many GuestSavedArticles to update.
     */
    limit?: number
  }

  /**
   * GuestSavedArticle updateManyAndReturn
   */
  export type GuestSavedArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * The data used to update GuestSavedArticles.
     */
    data: XOR<GuestSavedArticleUpdateManyMutationInput, GuestSavedArticleUncheckedUpdateManyInput>
    /**
     * Filter which GuestSavedArticles to update
     */
    where?: GuestSavedArticleWhereInput
    /**
     * Limit how many GuestSavedArticles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuestSavedArticle upsert
   */
  export type GuestSavedArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the GuestSavedArticle to update in case it exists.
     */
    where: GuestSavedArticleWhereUniqueInput
    /**
     * In case the GuestSavedArticle found by the `where` argument doesn't exist, create a new GuestSavedArticle with this data.
     */
    create: XOR<GuestSavedArticleCreateInput, GuestSavedArticleUncheckedCreateInput>
    /**
     * In case the GuestSavedArticle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestSavedArticleUpdateInput, GuestSavedArticleUncheckedUpdateInput>
  }

  /**
   * GuestSavedArticle delete
   */
  export type GuestSavedArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    /**
     * Filter which GuestSavedArticle to delete.
     */
    where: GuestSavedArticleWhereUniqueInput
  }

  /**
   * GuestSavedArticle deleteMany
   */
  export type GuestSavedArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestSavedArticles to delete
     */
    where?: GuestSavedArticleWhereInput
    /**
     * Limit how many GuestSavedArticles to delete.
     */
    limit?: number
  }

  /**
   * GuestSavedArticle without action
   */
  export type GuestSavedArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
  }


  /**
   * Model GuestReadingHistory
   */

  export type AggregateGuestReadingHistory = {
    _count: GuestReadingHistoryCountAggregateOutputType | null
    _min: GuestReadingHistoryMinAggregateOutputType | null
    _max: GuestReadingHistoryMaxAggregateOutputType | null
  }

  export type GuestReadingHistoryMinAggregateOutputType = {
    id: string | null
    guestSessionId: string | null
    articleId: string | null
    readAt: Date | null
  }

  export type GuestReadingHistoryMaxAggregateOutputType = {
    id: string | null
    guestSessionId: string | null
    articleId: string | null
    readAt: Date | null
  }

  export type GuestReadingHistoryCountAggregateOutputType = {
    id: number
    guestSessionId: number
    articleId: number
    readAt: number
    _all: number
  }


  export type GuestReadingHistoryMinAggregateInputType = {
    id?: true
    guestSessionId?: true
    articleId?: true
    readAt?: true
  }

  export type GuestReadingHistoryMaxAggregateInputType = {
    id?: true
    guestSessionId?: true
    articleId?: true
    readAt?: true
  }

  export type GuestReadingHistoryCountAggregateInputType = {
    id?: true
    guestSessionId?: true
    articleId?: true
    readAt?: true
    _all?: true
  }

  export type GuestReadingHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestReadingHistory to aggregate.
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestReadingHistories to fetch.
     */
    orderBy?: GuestReadingHistoryOrderByWithRelationInput | GuestReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuestReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GuestReadingHistories
    **/
    _count?: true | GuestReadingHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuestReadingHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuestReadingHistoryMaxAggregateInputType
  }

  export type GetGuestReadingHistoryAggregateType<T extends GuestReadingHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateGuestReadingHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuestReadingHistory[P]>
      : GetScalarType<T[P], AggregateGuestReadingHistory[P]>
  }




  export type GuestReadingHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuestReadingHistoryWhereInput
    orderBy?: GuestReadingHistoryOrderByWithAggregationInput | GuestReadingHistoryOrderByWithAggregationInput[]
    by: GuestReadingHistoryScalarFieldEnum[] | GuestReadingHistoryScalarFieldEnum
    having?: GuestReadingHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuestReadingHistoryCountAggregateInputType | true
    _min?: GuestReadingHistoryMinAggregateInputType
    _max?: GuestReadingHistoryMaxAggregateInputType
  }

  export type GuestReadingHistoryGroupByOutputType = {
    id: string
    guestSessionId: string
    articleId: string
    readAt: Date
    _count: GuestReadingHistoryCountAggregateOutputType | null
    _min: GuestReadingHistoryMinAggregateOutputType | null
    _max: GuestReadingHistoryMaxAggregateOutputType | null
  }

  type GetGuestReadingHistoryGroupByPayload<T extends GuestReadingHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuestReadingHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuestReadingHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuestReadingHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], GuestReadingHistoryGroupByOutputType[P]>
        }
      >
    >


  export type GuestReadingHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    readAt?: boolean
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestReadingHistory"]>

  export type GuestReadingHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    readAt?: boolean
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestReadingHistory"]>

  export type GuestReadingHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    readAt?: boolean
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guestReadingHistory"]>

  export type GuestReadingHistorySelectScalar = {
    id?: boolean
    guestSessionId?: boolean
    articleId?: boolean
    readAt?: boolean
  }

  export type GuestReadingHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "guestSessionId" | "articleId" | "readAt", ExtArgs["result"]["guestReadingHistory"]>
  export type GuestReadingHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type GuestReadingHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type GuestReadingHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | GuestSessionDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $GuestReadingHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GuestReadingHistory"
    objects: {
      session: Prisma.$GuestSessionPayload<ExtArgs>
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      guestSessionId: string
      articleId: string
      readAt: Date
    }, ExtArgs["result"]["guestReadingHistory"]>
    composites: {}
  }

  type GuestReadingHistoryGetPayload<S extends boolean | null | undefined | GuestReadingHistoryDefaultArgs> = $Result.GetResult<Prisma.$GuestReadingHistoryPayload, S>

  type GuestReadingHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuestReadingHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuestReadingHistoryCountAggregateInputType | true
    }

  export interface GuestReadingHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GuestReadingHistory'], meta: { name: 'GuestReadingHistory' } }
    /**
     * Find zero or one GuestReadingHistory that matches the filter.
     * @param {GuestReadingHistoryFindUniqueArgs} args - Arguments to find a GuestReadingHistory
     * @example
     * // Get one GuestReadingHistory
     * const guestReadingHistory = await prisma.guestReadingHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuestReadingHistoryFindUniqueArgs>(args: SelectSubset<T, GuestReadingHistoryFindUniqueArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GuestReadingHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuestReadingHistoryFindUniqueOrThrowArgs} args - Arguments to find a GuestReadingHistory
     * @example
     * // Get one GuestReadingHistory
     * const guestReadingHistory = await prisma.guestReadingHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuestReadingHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, GuestReadingHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuestReadingHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryFindFirstArgs} args - Arguments to find a GuestReadingHistory
     * @example
     * // Get one GuestReadingHistory
     * const guestReadingHistory = await prisma.guestReadingHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuestReadingHistoryFindFirstArgs>(args?: SelectSubset<T, GuestReadingHistoryFindFirstArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GuestReadingHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryFindFirstOrThrowArgs} args - Arguments to find a GuestReadingHistory
     * @example
     * // Get one GuestReadingHistory
     * const guestReadingHistory = await prisma.guestReadingHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuestReadingHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, GuestReadingHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GuestReadingHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GuestReadingHistories
     * const guestReadingHistories = await prisma.guestReadingHistory.findMany()
     * 
     * // Get first 10 GuestReadingHistories
     * const guestReadingHistories = await prisma.guestReadingHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guestReadingHistoryWithIdOnly = await prisma.guestReadingHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuestReadingHistoryFindManyArgs>(args?: SelectSubset<T, GuestReadingHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GuestReadingHistory.
     * @param {GuestReadingHistoryCreateArgs} args - Arguments to create a GuestReadingHistory.
     * @example
     * // Create one GuestReadingHistory
     * const GuestReadingHistory = await prisma.guestReadingHistory.create({
     *   data: {
     *     // ... data to create a GuestReadingHistory
     *   }
     * })
     * 
     */
    create<T extends GuestReadingHistoryCreateArgs>(args: SelectSubset<T, GuestReadingHistoryCreateArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GuestReadingHistories.
     * @param {GuestReadingHistoryCreateManyArgs} args - Arguments to create many GuestReadingHistories.
     * @example
     * // Create many GuestReadingHistories
     * const guestReadingHistory = await prisma.guestReadingHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuestReadingHistoryCreateManyArgs>(args?: SelectSubset<T, GuestReadingHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GuestReadingHistories and returns the data saved in the database.
     * @param {GuestReadingHistoryCreateManyAndReturnArgs} args - Arguments to create many GuestReadingHistories.
     * @example
     * // Create many GuestReadingHistories
     * const guestReadingHistory = await prisma.guestReadingHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GuestReadingHistories and only return the `id`
     * const guestReadingHistoryWithIdOnly = await prisma.guestReadingHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuestReadingHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, GuestReadingHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GuestReadingHistory.
     * @param {GuestReadingHistoryDeleteArgs} args - Arguments to delete one GuestReadingHistory.
     * @example
     * // Delete one GuestReadingHistory
     * const GuestReadingHistory = await prisma.guestReadingHistory.delete({
     *   where: {
     *     // ... filter to delete one GuestReadingHistory
     *   }
     * })
     * 
     */
    delete<T extends GuestReadingHistoryDeleteArgs>(args: SelectSubset<T, GuestReadingHistoryDeleteArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GuestReadingHistory.
     * @param {GuestReadingHistoryUpdateArgs} args - Arguments to update one GuestReadingHistory.
     * @example
     * // Update one GuestReadingHistory
     * const guestReadingHistory = await prisma.guestReadingHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuestReadingHistoryUpdateArgs>(args: SelectSubset<T, GuestReadingHistoryUpdateArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GuestReadingHistories.
     * @param {GuestReadingHistoryDeleteManyArgs} args - Arguments to filter GuestReadingHistories to delete.
     * @example
     * // Delete a few GuestReadingHistories
     * const { count } = await prisma.guestReadingHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuestReadingHistoryDeleteManyArgs>(args?: SelectSubset<T, GuestReadingHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestReadingHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GuestReadingHistories
     * const guestReadingHistory = await prisma.guestReadingHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuestReadingHistoryUpdateManyArgs>(args: SelectSubset<T, GuestReadingHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GuestReadingHistories and returns the data updated in the database.
     * @param {GuestReadingHistoryUpdateManyAndReturnArgs} args - Arguments to update many GuestReadingHistories.
     * @example
     * // Update many GuestReadingHistories
     * const guestReadingHistory = await prisma.guestReadingHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GuestReadingHistories and only return the `id`
     * const guestReadingHistoryWithIdOnly = await prisma.guestReadingHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuestReadingHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, GuestReadingHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GuestReadingHistory.
     * @param {GuestReadingHistoryUpsertArgs} args - Arguments to update or create a GuestReadingHistory.
     * @example
     * // Update or create a GuestReadingHistory
     * const guestReadingHistory = await prisma.guestReadingHistory.upsert({
     *   create: {
     *     // ... data to create a GuestReadingHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GuestReadingHistory we want to update
     *   }
     * })
     */
    upsert<T extends GuestReadingHistoryUpsertArgs>(args: SelectSubset<T, GuestReadingHistoryUpsertArgs<ExtArgs>>): Prisma__GuestReadingHistoryClient<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GuestReadingHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryCountArgs} args - Arguments to filter GuestReadingHistories to count.
     * @example
     * // Count the number of GuestReadingHistories
     * const count = await prisma.guestReadingHistory.count({
     *   where: {
     *     // ... the filter for the GuestReadingHistories we want to count
     *   }
     * })
    **/
    count<T extends GuestReadingHistoryCountArgs>(
      args?: Subset<T, GuestReadingHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuestReadingHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GuestReadingHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GuestReadingHistoryAggregateArgs>(args: Subset<T, GuestReadingHistoryAggregateArgs>): Prisma.PrismaPromise<GetGuestReadingHistoryAggregateType<T>>

    /**
     * Group by GuestReadingHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuestReadingHistoryGroupByArgs} args - Group by arguments.
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
      T extends GuestReadingHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuestReadingHistoryGroupByArgs['orderBy'] }
        : { orderBy?: GuestReadingHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuestReadingHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuestReadingHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GuestReadingHistory model
   */
  readonly fields: GuestReadingHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GuestReadingHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuestReadingHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends GuestSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuestSessionDefaultArgs<ExtArgs>>): Prisma__GuestSessionClient<$Result.GetResult<Prisma.$GuestSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GuestReadingHistory model
   */
  interface GuestReadingHistoryFieldRefs {
    readonly id: FieldRef<"GuestReadingHistory", 'String'>
    readonly guestSessionId: FieldRef<"GuestReadingHistory", 'String'>
    readonly articleId: FieldRef<"GuestReadingHistory", 'String'>
    readonly readAt: FieldRef<"GuestReadingHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GuestReadingHistory findUnique
   */
  export type GuestReadingHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GuestReadingHistory to fetch.
     */
    where: GuestReadingHistoryWhereUniqueInput
  }

  /**
   * GuestReadingHistory findUniqueOrThrow
   */
  export type GuestReadingHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GuestReadingHistory to fetch.
     */
    where: GuestReadingHistoryWhereUniqueInput
  }

  /**
   * GuestReadingHistory findFirst
   */
  export type GuestReadingHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GuestReadingHistory to fetch.
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestReadingHistories to fetch.
     */
    orderBy?: GuestReadingHistoryOrderByWithRelationInput | GuestReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestReadingHistories.
     */
    cursor?: GuestReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestReadingHistories.
     */
    distinct?: GuestReadingHistoryScalarFieldEnum | GuestReadingHistoryScalarFieldEnum[]
  }

  /**
   * GuestReadingHistory findFirstOrThrow
   */
  export type GuestReadingHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GuestReadingHistory to fetch.
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestReadingHistories to fetch.
     */
    orderBy?: GuestReadingHistoryOrderByWithRelationInput | GuestReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GuestReadingHistories.
     */
    cursor?: GuestReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestReadingHistories.
     */
    distinct?: GuestReadingHistoryScalarFieldEnum | GuestReadingHistoryScalarFieldEnum[]
  }

  /**
   * GuestReadingHistory findMany
   */
  export type GuestReadingHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which GuestReadingHistories to fetch.
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GuestReadingHistories to fetch.
     */
    orderBy?: GuestReadingHistoryOrderByWithRelationInput | GuestReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GuestReadingHistories.
     */
    cursor?: GuestReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GuestReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GuestReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GuestReadingHistories.
     */
    distinct?: GuestReadingHistoryScalarFieldEnum | GuestReadingHistoryScalarFieldEnum[]
  }

  /**
   * GuestReadingHistory create
   */
  export type GuestReadingHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a GuestReadingHistory.
     */
    data: XOR<GuestReadingHistoryCreateInput, GuestReadingHistoryUncheckedCreateInput>
  }

  /**
   * GuestReadingHistory createMany
   */
  export type GuestReadingHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GuestReadingHistories.
     */
    data: GuestReadingHistoryCreateManyInput | GuestReadingHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GuestReadingHistory createManyAndReturn
   */
  export type GuestReadingHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many GuestReadingHistories.
     */
    data: GuestReadingHistoryCreateManyInput | GuestReadingHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuestReadingHistory update
   */
  export type GuestReadingHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a GuestReadingHistory.
     */
    data: XOR<GuestReadingHistoryUpdateInput, GuestReadingHistoryUncheckedUpdateInput>
    /**
     * Choose, which GuestReadingHistory to update.
     */
    where: GuestReadingHistoryWhereUniqueInput
  }

  /**
   * GuestReadingHistory updateMany
   */
  export type GuestReadingHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GuestReadingHistories.
     */
    data: XOR<GuestReadingHistoryUpdateManyMutationInput, GuestReadingHistoryUncheckedUpdateManyInput>
    /**
     * Filter which GuestReadingHistories to update
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * Limit how many GuestReadingHistories to update.
     */
    limit?: number
  }

  /**
   * GuestReadingHistory updateManyAndReturn
   */
  export type GuestReadingHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * The data used to update GuestReadingHistories.
     */
    data: XOR<GuestReadingHistoryUpdateManyMutationInput, GuestReadingHistoryUncheckedUpdateManyInput>
    /**
     * Filter which GuestReadingHistories to update
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * Limit how many GuestReadingHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GuestReadingHistory upsert
   */
  export type GuestReadingHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the GuestReadingHistory to update in case it exists.
     */
    where: GuestReadingHistoryWhereUniqueInput
    /**
     * In case the GuestReadingHistory found by the `where` argument doesn't exist, create a new GuestReadingHistory with this data.
     */
    create: XOR<GuestReadingHistoryCreateInput, GuestReadingHistoryUncheckedCreateInput>
    /**
     * In case the GuestReadingHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuestReadingHistoryUpdateInput, GuestReadingHistoryUncheckedUpdateInput>
  }

  /**
   * GuestReadingHistory delete
   */
  export type GuestReadingHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter which GuestReadingHistory to delete.
     */
    where: GuestReadingHistoryWhereUniqueInput
  }

  /**
   * GuestReadingHistory deleteMany
   */
  export type GuestReadingHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GuestReadingHistories to delete
     */
    where?: GuestReadingHistoryWhereInput
    /**
     * Limit how many GuestReadingHistories to delete.
     */
    limit?: number
  }

  /**
   * GuestReadingHistory without action
   */
  export type GuestReadingHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
  }


  /**
   * Model SavedArticle
   */

  export type AggregateSavedArticle = {
    _count: SavedArticleCountAggregateOutputType | null
    _min: SavedArticleMinAggregateOutputType | null
    _max: SavedArticleMaxAggregateOutputType | null
  }

  export type SavedArticleMinAggregateOutputType = {
    id: string | null
    userId: string | null
    articleId: string | null
    savedAt: Date | null
  }

  export type SavedArticleMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    articleId: string | null
    savedAt: Date | null
  }

  export type SavedArticleCountAggregateOutputType = {
    id: number
    userId: number
    articleId: number
    savedAt: number
    _all: number
  }


  export type SavedArticleMinAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    savedAt?: true
  }

  export type SavedArticleMaxAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    savedAt?: true
  }

  export type SavedArticleCountAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    savedAt?: true
    _all?: true
  }

  export type SavedArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedArticle to aggregate.
     */
    where?: SavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedArticles to fetch.
     */
    orderBy?: SavedArticleOrderByWithRelationInput | SavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SavedArticles
    **/
    _count?: true | SavedArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SavedArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SavedArticleMaxAggregateInputType
  }

  export type GetSavedArticleAggregateType<T extends SavedArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateSavedArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSavedArticle[P]>
      : GetScalarType<T[P], AggregateSavedArticle[P]>
  }




  export type SavedArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedArticleWhereInput
    orderBy?: SavedArticleOrderByWithAggregationInput | SavedArticleOrderByWithAggregationInput[]
    by: SavedArticleScalarFieldEnum[] | SavedArticleScalarFieldEnum
    having?: SavedArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SavedArticleCountAggregateInputType | true
    _min?: SavedArticleMinAggregateInputType
    _max?: SavedArticleMaxAggregateInputType
  }

  export type SavedArticleGroupByOutputType = {
    id: string
    userId: string
    articleId: string
    savedAt: Date
    _count: SavedArticleCountAggregateOutputType | null
    _min: SavedArticleMinAggregateOutputType | null
    _max: SavedArticleMaxAggregateOutputType | null
  }

  type GetSavedArticleGroupByPayload<T extends SavedArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SavedArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SavedArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SavedArticleGroupByOutputType[P]>
            : GetScalarType<T[P], SavedArticleGroupByOutputType[P]>
        }
      >
    >


  export type SavedArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    savedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedArticle"]>

  export type SavedArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    savedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedArticle"]>

  export type SavedArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    savedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["savedArticle"]>

  export type SavedArticleSelectScalar = {
    id?: boolean
    userId?: boolean
    articleId?: boolean
    savedAt?: boolean
  }

  export type SavedArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "articleId" | "savedAt", ExtArgs["result"]["savedArticle"]>
  export type SavedArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type SavedArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type SavedArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $SavedArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SavedArticle"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      articleId: string
      savedAt: Date
    }, ExtArgs["result"]["savedArticle"]>
    composites: {}
  }

  type SavedArticleGetPayload<S extends boolean | null | undefined | SavedArticleDefaultArgs> = $Result.GetResult<Prisma.$SavedArticlePayload, S>

  type SavedArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SavedArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SavedArticleCountAggregateInputType | true
    }

  export interface SavedArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SavedArticle'], meta: { name: 'SavedArticle' } }
    /**
     * Find zero or one SavedArticle that matches the filter.
     * @param {SavedArticleFindUniqueArgs} args - Arguments to find a SavedArticle
     * @example
     * // Get one SavedArticle
     * const savedArticle = await prisma.savedArticle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavedArticleFindUniqueArgs>(args: SelectSubset<T, SavedArticleFindUniqueArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SavedArticle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SavedArticleFindUniqueOrThrowArgs} args - Arguments to find a SavedArticle
     * @example
     * // Get one SavedArticle
     * const savedArticle = await prisma.savedArticle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavedArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, SavedArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedArticle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleFindFirstArgs} args - Arguments to find a SavedArticle
     * @example
     * // Get one SavedArticle
     * const savedArticle = await prisma.savedArticle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavedArticleFindFirstArgs>(args?: SelectSubset<T, SavedArticleFindFirstArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedArticle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleFindFirstOrThrowArgs} args - Arguments to find a SavedArticle
     * @example
     * // Get one SavedArticle
     * const savedArticle = await prisma.savedArticle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavedArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, SavedArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SavedArticles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavedArticles
     * const savedArticles = await prisma.savedArticle.findMany()
     * 
     * // Get first 10 SavedArticles
     * const savedArticles = await prisma.savedArticle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const savedArticleWithIdOnly = await prisma.savedArticle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SavedArticleFindManyArgs>(args?: SelectSubset<T, SavedArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SavedArticle.
     * @param {SavedArticleCreateArgs} args - Arguments to create a SavedArticle.
     * @example
     * // Create one SavedArticle
     * const SavedArticle = await prisma.savedArticle.create({
     *   data: {
     *     // ... data to create a SavedArticle
     *   }
     * })
     * 
     */
    create<T extends SavedArticleCreateArgs>(args: SelectSubset<T, SavedArticleCreateArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SavedArticles.
     * @param {SavedArticleCreateManyArgs} args - Arguments to create many SavedArticles.
     * @example
     * // Create many SavedArticles
     * const savedArticle = await prisma.savedArticle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SavedArticleCreateManyArgs>(args?: SelectSubset<T, SavedArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SavedArticles and returns the data saved in the database.
     * @param {SavedArticleCreateManyAndReturnArgs} args - Arguments to create many SavedArticles.
     * @example
     * // Create many SavedArticles
     * const savedArticle = await prisma.savedArticle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SavedArticles and only return the `id`
     * const savedArticleWithIdOnly = await prisma.savedArticle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SavedArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, SavedArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SavedArticle.
     * @param {SavedArticleDeleteArgs} args - Arguments to delete one SavedArticle.
     * @example
     * // Delete one SavedArticle
     * const SavedArticle = await prisma.savedArticle.delete({
     *   where: {
     *     // ... filter to delete one SavedArticle
     *   }
     * })
     * 
     */
    delete<T extends SavedArticleDeleteArgs>(args: SelectSubset<T, SavedArticleDeleteArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SavedArticle.
     * @param {SavedArticleUpdateArgs} args - Arguments to update one SavedArticle.
     * @example
     * // Update one SavedArticle
     * const savedArticle = await prisma.savedArticle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SavedArticleUpdateArgs>(args: SelectSubset<T, SavedArticleUpdateArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SavedArticles.
     * @param {SavedArticleDeleteManyArgs} args - Arguments to filter SavedArticles to delete.
     * @example
     * // Delete a few SavedArticles
     * const { count } = await prisma.savedArticle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SavedArticleDeleteManyArgs>(args?: SelectSubset<T, SavedArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedArticles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavedArticles
     * const savedArticle = await prisma.savedArticle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SavedArticleUpdateManyArgs>(args: SelectSubset<T, SavedArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedArticles and returns the data updated in the database.
     * @param {SavedArticleUpdateManyAndReturnArgs} args - Arguments to update many SavedArticles.
     * @example
     * // Update many SavedArticles
     * const savedArticle = await prisma.savedArticle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SavedArticles and only return the `id`
     * const savedArticleWithIdOnly = await prisma.savedArticle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SavedArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, SavedArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SavedArticle.
     * @param {SavedArticleUpsertArgs} args - Arguments to update or create a SavedArticle.
     * @example
     * // Update or create a SavedArticle
     * const savedArticle = await prisma.savedArticle.upsert({
     *   create: {
     *     // ... data to create a SavedArticle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavedArticle we want to update
     *   }
     * })
     */
    upsert<T extends SavedArticleUpsertArgs>(args: SelectSubset<T, SavedArticleUpsertArgs<ExtArgs>>): Prisma__SavedArticleClient<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SavedArticles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleCountArgs} args - Arguments to filter SavedArticles to count.
     * @example
     * // Count the number of SavedArticles
     * const count = await prisma.savedArticle.count({
     *   where: {
     *     // ... the filter for the SavedArticles we want to count
     *   }
     * })
    **/
    count<T extends SavedArticleCountArgs>(
      args?: Subset<T, SavedArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SavedArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SavedArticle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SavedArticleAggregateArgs>(args: Subset<T, SavedArticleAggregateArgs>): Prisma.PrismaPromise<GetSavedArticleAggregateType<T>>

    /**
     * Group by SavedArticle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedArticleGroupByArgs} args - Group by arguments.
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
      T extends SavedArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SavedArticleGroupByArgs['orderBy'] }
        : { orderBy?: SavedArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SavedArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SavedArticle model
   */
  readonly fields: SavedArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SavedArticle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SavedArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SavedArticle model
   */
  interface SavedArticleFieldRefs {
    readonly id: FieldRef<"SavedArticle", 'String'>
    readonly userId: FieldRef<"SavedArticle", 'String'>
    readonly articleId: FieldRef<"SavedArticle", 'String'>
    readonly savedAt: FieldRef<"SavedArticle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SavedArticle findUnique
   */
  export type SavedArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which SavedArticle to fetch.
     */
    where: SavedArticleWhereUniqueInput
  }

  /**
   * SavedArticle findUniqueOrThrow
   */
  export type SavedArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which SavedArticle to fetch.
     */
    where: SavedArticleWhereUniqueInput
  }

  /**
   * SavedArticle findFirst
   */
  export type SavedArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which SavedArticle to fetch.
     */
    where?: SavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedArticles to fetch.
     */
    orderBy?: SavedArticleOrderByWithRelationInput | SavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedArticles.
     */
    cursor?: SavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedArticles.
     */
    distinct?: SavedArticleScalarFieldEnum | SavedArticleScalarFieldEnum[]
  }

  /**
   * SavedArticle findFirstOrThrow
   */
  export type SavedArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which SavedArticle to fetch.
     */
    where?: SavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedArticles to fetch.
     */
    orderBy?: SavedArticleOrderByWithRelationInput | SavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedArticles.
     */
    cursor?: SavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedArticles.
     */
    distinct?: SavedArticleScalarFieldEnum | SavedArticleScalarFieldEnum[]
  }

  /**
   * SavedArticle findMany
   */
  export type SavedArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * Filter, which SavedArticles to fetch.
     */
    where?: SavedArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedArticles to fetch.
     */
    orderBy?: SavedArticleOrderByWithRelationInput | SavedArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SavedArticles.
     */
    cursor?: SavedArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedArticles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedArticles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedArticles.
     */
    distinct?: SavedArticleScalarFieldEnum | SavedArticleScalarFieldEnum[]
  }

  /**
   * SavedArticle create
   */
  export type SavedArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a SavedArticle.
     */
    data: XOR<SavedArticleCreateInput, SavedArticleUncheckedCreateInput>
  }

  /**
   * SavedArticle createMany
   */
  export type SavedArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavedArticles.
     */
    data: SavedArticleCreateManyInput | SavedArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedArticle createManyAndReturn
   */
  export type SavedArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * The data used to create many SavedArticles.
     */
    data: SavedArticleCreateManyInput | SavedArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedArticle update
   */
  export type SavedArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a SavedArticle.
     */
    data: XOR<SavedArticleUpdateInput, SavedArticleUncheckedUpdateInput>
    /**
     * Choose, which SavedArticle to update.
     */
    where: SavedArticleWhereUniqueInput
  }

  /**
   * SavedArticle updateMany
   */
  export type SavedArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SavedArticles.
     */
    data: XOR<SavedArticleUpdateManyMutationInput, SavedArticleUncheckedUpdateManyInput>
    /**
     * Filter which SavedArticles to update
     */
    where?: SavedArticleWhereInput
    /**
     * Limit how many SavedArticles to update.
     */
    limit?: number
  }

  /**
   * SavedArticle updateManyAndReturn
   */
  export type SavedArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * The data used to update SavedArticles.
     */
    data: XOR<SavedArticleUpdateManyMutationInput, SavedArticleUncheckedUpdateManyInput>
    /**
     * Filter which SavedArticles to update
     */
    where?: SavedArticleWhereInput
    /**
     * Limit how many SavedArticles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SavedArticle upsert
   */
  export type SavedArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the SavedArticle to update in case it exists.
     */
    where: SavedArticleWhereUniqueInput
    /**
     * In case the SavedArticle found by the `where` argument doesn't exist, create a new SavedArticle with this data.
     */
    create: XOR<SavedArticleCreateInput, SavedArticleUncheckedCreateInput>
    /**
     * In case the SavedArticle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SavedArticleUpdateInput, SavedArticleUncheckedUpdateInput>
  }

  /**
   * SavedArticle delete
   */
  export type SavedArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    /**
     * Filter which SavedArticle to delete.
     */
    where: SavedArticleWhereUniqueInput
  }

  /**
   * SavedArticle deleteMany
   */
  export type SavedArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedArticles to delete
     */
    where?: SavedArticleWhereInput
    /**
     * Limit how many SavedArticles to delete.
     */
    limit?: number
  }

  /**
   * SavedArticle without action
   */
  export type SavedArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
  }


  /**
   * Model ReadingHistory
   */

  export type AggregateReadingHistory = {
    _count: ReadingHistoryCountAggregateOutputType | null
    _min: ReadingHistoryMinAggregateOutputType | null
    _max: ReadingHistoryMaxAggregateOutputType | null
  }

  export type ReadingHistoryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    articleId: string | null
    readAt: Date | null
  }

  export type ReadingHistoryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    articleId: string | null
    readAt: Date | null
  }

  export type ReadingHistoryCountAggregateOutputType = {
    id: number
    userId: number
    articleId: number
    readAt: number
    _all: number
  }


  export type ReadingHistoryMinAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    readAt?: true
  }

  export type ReadingHistoryMaxAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    readAt?: true
  }

  export type ReadingHistoryCountAggregateInputType = {
    id?: true
    userId?: true
    articleId?: true
    readAt?: true
    _all?: true
  }

  export type ReadingHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingHistory to aggregate.
     */
    where?: ReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingHistories to fetch.
     */
    orderBy?: ReadingHistoryOrderByWithRelationInput | ReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReadingHistories
    **/
    _count?: true | ReadingHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReadingHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReadingHistoryMaxAggregateInputType
  }

  export type GetReadingHistoryAggregateType<T extends ReadingHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateReadingHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReadingHistory[P]>
      : GetScalarType<T[P], AggregateReadingHistory[P]>
  }




  export type ReadingHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingHistoryWhereInput
    orderBy?: ReadingHistoryOrderByWithAggregationInput | ReadingHistoryOrderByWithAggregationInput[]
    by: ReadingHistoryScalarFieldEnum[] | ReadingHistoryScalarFieldEnum
    having?: ReadingHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReadingHistoryCountAggregateInputType | true
    _min?: ReadingHistoryMinAggregateInputType
    _max?: ReadingHistoryMaxAggregateInputType
  }

  export type ReadingHistoryGroupByOutputType = {
    id: string
    userId: string
    articleId: string
    readAt: Date
    _count: ReadingHistoryCountAggregateOutputType | null
    _min: ReadingHistoryMinAggregateOutputType | null
    _max: ReadingHistoryMaxAggregateOutputType | null
  }

  type GetReadingHistoryGroupByPayload<T extends ReadingHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReadingHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReadingHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReadingHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], ReadingHistoryGroupByOutputType[P]>
        }
      >
    >


  export type ReadingHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    readAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingHistory"]>

  export type ReadingHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    readAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingHistory"]>

  export type ReadingHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    articleId?: boolean
    readAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["readingHistory"]>

  export type ReadingHistorySelectScalar = {
    id?: boolean
    userId?: boolean
    articleId?: boolean
    readAt?: boolean
  }

  export type ReadingHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "articleId" | "readAt", ExtArgs["result"]["readingHistory"]>
  export type ReadingHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ReadingHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }
  export type ReadingHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    article?: boolean | ArticleDefaultArgs<ExtArgs>
  }

  export type $ReadingHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReadingHistory"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      article: Prisma.$ArticlePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      articleId: string
      readAt: Date
    }, ExtArgs["result"]["readingHistory"]>
    composites: {}
  }

  type ReadingHistoryGetPayload<S extends boolean | null | undefined | ReadingHistoryDefaultArgs> = $Result.GetResult<Prisma.$ReadingHistoryPayload, S>

  type ReadingHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReadingHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReadingHistoryCountAggregateInputType | true
    }

  export interface ReadingHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReadingHistory'], meta: { name: 'ReadingHistory' } }
    /**
     * Find zero or one ReadingHistory that matches the filter.
     * @param {ReadingHistoryFindUniqueArgs} args - Arguments to find a ReadingHistory
     * @example
     * // Get one ReadingHistory
     * const readingHistory = await prisma.readingHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReadingHistoryFindUniqueArgs>(args: SelectSubset<T, ReadingHistoryFindUniqueArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReadingHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReadingHistoryFindUniqueOrThrowArgs} args - Arguments to find a ReadingHistory
     * @example
     * // Get one ReadingHistory
     * const readingHistory = await prisma.readingHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReadingHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, ReadingHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReadingHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryFindFirstArgs} args - Arguments to find a ReadingHistory
     * @example
     * // Get one ReadingHistory
     * const readingHistory = await prisma.readingHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReadingHistoryFindFirstArgs>(args?: SelectSubset<T, ReadingHistoryFindFirstArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReadingHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryFindFirstOrThrowArgs} args - Arguments to find a ReadingHistory
     * @example
     * // Get one ReadingHistory
     * const readingHistory = await prisma.readingHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReadingHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, ReadingHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReadingHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReadingHistories
     * const readingHistories = await prisma.readingHistory.findMany()
     * 
     * // Get first 10 ReadingHistories
     * const readingHistories = await prisma.readingHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const readingHistoryWithIdOnly = await prisma.readingHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReadingHistoryFindManyArgs>(args?: SelectSubset<T, ReadingHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReadingHistory.
     * @param {ReadingHistoryCreateArgs} args - Arguments to create a ReadingHistory.
     * @example
     * // Create one ReadingHistory
     * const ReadingHistory = await prisma.readingHistory.create({
     *   data: {
     *     // ... data to create a ReadingHistory
     *   }
     * })
     * 
     */
    create<T extends ReadingHistoryCreateArgs>(args: SelectSubset<T, ReadingHistoryCreateArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReadingHistories.
     * @param {ReadingHistoryCreateManyArgs} args - Arguments to create many ReadingHistories.
     * @example
     * // Create many ReadingHistories
     * const readingHistory = await prisma.readingHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReadingHistoryCreateManyArgs>(args?: SelectSubset<T, ReadingHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReadingHistories and returns the data saved in the database.
     * @param {ReadingHistoryCreateManyAndReturnArgs} args - Arguments to create many ReadingHistories.
     * @example
     * // Create many ReadingHistories
     * const readingHistory = await prisma.readingHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReadingHistories and only return the `id`
     * const readingHistoryWithIdOnly = await prisma.readingHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReadingHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, ReadingHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReadingHistory.
     * @param {ReadingHistoryDeleteArgs} args - Arguments to delete one ReadingHistory.
     * @example
     * // Delete one ReadingHistory
     * const ReadingHistory = await prisma.readingHistory.delete({
     *   where: {
     *     // ... filter to delete one ReadingHistory
     *   }
     * })
     * 
     */
    delete<T extends ReadingHistoryDeleteArgs>(args: SelectSubset<T, ReadingHistoryDeleteArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReadingHistory.
     * @param {ReadingHistoryUpdateArgs} args - Arguments to update one ReadingHistory.
     * @example
     * // Update one ReadingHistory
     * const readingHistory = await prisma.readingHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReadingHistoryUpdateArgs>(args: SelectSubset<T, ReadingHistoryUpdateArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReadingHistories.
     * @param {ReadingHistoryDeleteManyArgs} args - Arguments to filter ReadingHistories to delete.
     * @example
     * // Delete a few ReadingHistories
     * const { count } = await prisma.readingHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReadingHistoryDeleteManyArgs>(args?: SelectSubset<T, ReadingHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReadingHistories
     * const readingHistory = await prisma.readingHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReadingHistoryUpdateManyArgs>(args: SelectSubset<T, ReadingHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingHistories and returns the data updated in the database.
     * @param {ReadingHistoryUpdateManyAndReturnArgs} args - Arguments to update many ReadingHistories.
     * @example
     * // Update many ReadingHistories
     * const readingHistory = await prisma.readingHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReadingHistories and only return the `id`
     * const readingHistoryWithIdOnly = await prisma.readingHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReadingHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, ReadingHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReadingHistory.
     * @param {ReadingHistoryUpsertArgs} args - Arguments to update or create a ReadingHistory.
     * @example
     * // Update or create a ReadingHistory
     * const readingHistory = await prisma.readingHistory.upsert({
     *   create: {
     *     // ... data to create a ReadingHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReadingHistory we want to update
     *   }
     * })
     */
    upsert<T extends ReadingHistoryUpsertArgs>(args: SelectSubset<T, ReadingHistoryUpsertArgs<ExtArgs>>): Prisma__ReadingHistoryClient<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReadingHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryCountArgs} args - Arguments to filter ReadingHistories to count.
     * @example
     * // Count the number of ReadingHistories
     * const count = await prisma.readingHistory.count({
     *   where: {
     *     // ... the filter for the ReadingHistories we want to count
     *   }
     * })
    **/
    count<T extends ReadingHistoryCountArgs>(
      args?: Subset<T, ReadingHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReadingHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReadingHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReadingHistoryAggregateArgs>(args: Subset<T, ReadingHistoryAggregateArgs>): Prisma.PrismaPromise<GetReadingHistoryAggregateType<T>>

    /**
     * Group by ReadingHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingHistoryGroupByArgs} args - Group by arguments.
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
      T extends ReadingHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReadingHistoryGroupByArgs['orderBy'] }
        : { orderBy?: ReadingHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReadingHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReadingHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReadingHistory model
   */
  readonly fields: ReadingHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReadingHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReadingHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    article<T extends ArticleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticleDefaultArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReadingHistory model
   */
  interface ReadingHistoryFieldRefs {
    readonly id: FieldRef<"ReadingHistory", 'String'>
    readonly userId: FieldRef<"ReadingHistory", 'String'>
    readonly articleId: FieldRef<"ReadingHistory", 'String'>
    readonly readAt: FieldRef<"ReadingHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReadingHistory findUnique
   */
  export type ReadingHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ReadingHistory to fetch.
     */
    where: ReadingHistoryWhereUniqueInput
  }

  /**
   * ReadingHistory findUniqueOrThrow
   */
  export type ReadingHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ReadingHistory to fetch.
     */
    where: ReadingHistoryWhereUniqueInput
  }

  /**
   * ReadingHistory findFirst
   */
  export type ReadingHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ReadingHistory to fetch.
     */
    where?: ReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingHistories to fetch.
     */
    orderBy?: ReadingHistoryOrderByWithRelationInput | ReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingHistories.
     */
    cursor?: ReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingHistories.
     */
    distinct?: ReadingHistoryScalarFieldEnum | ReadingHistoryScalarFieldEnum[]
  }

  /**
   * ReadingHistory findFirstOrThrow
   */
  export type ReadingHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ReadingHistory to fetch.
     */
    where?: ReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingHistories to fetch.
     */
    orderBy?: ReadingHistoryOrderByWithRelationInput | ReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingHistories.
     */
    cursor?: ReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingHistories.
     */
    distinct?: ReadingHistoryScalarFieldEnum | ReadingHistoryScalarFieldEnum[]
  }

  /**
   * ReadingHistory findMany
   */
  export type ReadingHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter, which ReadingHistories to fetch.
     */
    where?: ReadingHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingHistories to fetch.
     */
    orderBy?: ReadingHistoryOrderByWithRelationInput | ReadingHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReadingHistories.
     */
    cursor?: ReadingHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingHistories.
     */
    distinct?: ReadingHistoryScalarFieldEnum | ReadingHistoryScalarFieldEnum[]
  }

  /**
   * ReadingHistory create
   */
  export type ReadingHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a ReadingHistory.
     */
    data: XOR<ReadingHistoryCreateInput, ReadingHistoryUncheckedCreateInput>
  }

  /**
   * ReadingHistory createMany
   */
  export type ReadingHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReadingHistories.
     */
    data: ReadingHistoryCreateManyInput | ReadingHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReadingHistory createManyAndReturn
   */
  export type ReadingHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many ReadingHistories.
     */
    data: ReadingHistoryCreateManyInput | ReadingHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReadingHistory update
   */
  export type ReadingHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a ReadingHistory.
     */
    data: XOR<ReadingHistoryUpdateInput, ReadingHistoryUncheckedUpdateInput>
    /**
     * Choose, which ReadingHistory to update.
     */
    where: ReadingHistoryWhereUniqueInput
  }

  /**
   * ReadingHistory updateMany
   */
  export type ReadingHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReadingHistories.
     */
    data: XOR<ReadingHistoryUpdateManyMutationInput, ReadingHistoryUncheckedUpdateManyInput>
    /**
     * Filter which ReadingHistories to update
     */
    where?: ReadingHistoryWhereInput
    /**
     * Limit how many ReadingHistories to update.
     */
    limit?: number
  }

  /**
   * ReadingHistory updateManyAndReturn
   */
  export type ReadingHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * The data used to update ReadingHistories.
     */
    data: XOR<ReadingHistoryUpdateManyMutationInput, ReadingHistoryUncheckedUpdateManyInput>
    /**
     * Filter which ReadingHistories to update
     */
    where?: ReadingHistoryWhereInput
    /**
     * Limit how many ReadingHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReadingHistory upsert
   */
  export type ReadingHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the ReadingHistory to update in case it exists.
     */
    where: ReadingHistoryWhereUniqueInput
    /**
     * In case the ReadingHistory found by the `where` argument doesn't exist, create a new ReadingHistory with this data.
     */
    create: XOR<ReadingHistoryCreateInput, ReadingHistoryUncheckedCreateInput>
    /**
     * In case the ReadingHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReadingHistoryUpdateInput, ReadingHistoryUncheckedUpdateInput>
  }

  /**
   * ReadingHistory delete
   */
  export type ReadingHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    /**
     * Filter which ReadingHistory to delete.
     */
    where: ReadingHistoryWhereUniqueInput
  }

  /**
   * ReadingHistory deleteMany
   */
  export type ReadingHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingHistories to delete
     */
    where?: ReadingHistoryWhereInput
    /**
     * Limit how many ReadingHistories to delete.
     */
    limit?: number
  }

  /**
   * ReadingHistory without action
   */
  export type ReadingHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
  }


  /**
   * Model Article
   */

  export type AggregateArticle = {
    _count: ArticleCountAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  export type ArticleMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    summary: string | null
    summaryFr: string | null
    summaryRw: string | null
    imageUrl: string | null
    originalLanguage: string | null
    source: string | null
    url: string | null
    category: string | null
    continent: string | null
    region: string | null
    country: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    clusterId: string | null
  }

  export type ArticleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    summary: string | null
    summaryFr: string | null
    summaryRw: string | null
    imageUrl: string | null
    originalLanguage: string | null
    source: string | null
    url: string | null
    category: string | null
    continent: string | null
    region: string | null
    country: string | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    clusterId: string | null
  }

  export type ArticleCountAggregateOutputType = {
    id: number
    title: number
    content: number
    summary: number
    summaryFr: number
    summaryRw: number
    imageUrl: number
    originalLanguage: number
    source: number
    url: number
    category: number
    continent: number
    region: number
    country: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    clusterId: number
    _all: number
  }


  export type ArticleMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    summary?: true
    summaryFr?: true
    summaryRw?: true
    imageUrl?: true
    originalLanguage?: true
    source?: true
    url?: true
    category?: true
    continent?: true
    region?: true
    country?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    clusterId?: true
  }

  export type ArticleMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    summary?: true
    summaryFr?: true
    summaryRw?: true
    imageUrl?: true
    originalLanguage?: true
    source?: true
    url?: true
    category?: true
    continent?: true
    region?: true
    country?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    clusterId?: true
  }

  export type ArticleCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    summary?: true
    summaryFr?: true
    summaryRw?: true
    imageUrl?: true
    originalLanguage?: true
    source?: true
    url?: true
    category?: true
    continent?: true
    region?: true
    country?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    clusterId?: true
    _all?: true
  }

  export type ArticleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Article to aggregate.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleMaxAggregateInputType
  }

  export type GetArticleAggregateType<T extends ArticleAggregateArgs> = {
        [P in keyof T & keyof AggregateArticle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticle[P]>
      : GetScalarType<T[P], AggregateArticle[P]>
  }




  export type ArticleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithAggregationInput | ArticleOrderByWithAggregationInput[]
    by: ArticleScalarFieldEnum[] | ArticleScalarFieldEnum
    having?: ArticleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleCountAggregateInputType | true
    _min?: ArticleMinAggregateInputType
    _max?: ArticleMaxAggregateInputType
  }

  export type ArticleGroupByOutputType = {
    id: string
    title: string
    content: string
    summary: string | null
    summaryFr: string | null
    summaryRw: string | null
    imageUrl: string | null
    originalLanguage: string
    source: string
    url: string
    category: string | null
    continent: string | null
    region: string | null
    country: string | null
    publishedAt: Date
    createdAt: Date
    updatedAt: Date
    clusterId: string | null
    _count: ArticleCountAggregateOutputType | null
    _min: ArticleMinAggregateOutputType | null
    _max: ArticleMaxAggregateOutputType | null
  }

  type GetArticleGroupByPayload<T extends ArticleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleGroupByOutputType[P]>
        }
      >
    >


  export type ArticleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    summaryFr?: boolean
    summaryRw?: boolean
    imageUrl?: boolean
    originalLanguage?: boolean
    source?: boolean
    url?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clusterId?: boolean
    cluster?: boolean | Article$clusterArgs<ExtArgs>
    savedBy?: boolean | Article$savedByArgs<ExtArgs>
    readingHistory?: boolean | Article$readingHistoryArgs<ExtArgs>
    guestSaves?: boolean | Article$guestSavesArgs<ExtArgs>
    guestReadingHistory?: boolean | Article$guestReadingHistoryArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    summaryFr?: boolean
    summaryRw?: boolean
    imageUrl?: boolean
    originalLanguage?: boolean
    source?: boolean
    url?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clusterId?: boolean
    cluster?: boolean | Article$clusterArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    summaryFr?: boolean
    summaryRw?: boolean
    imageUrl?: boolean
    originalLanguage?: boolean
    source?: boolean
    url?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clusterId?: boolean
    cluster?: boolean | Article$clusterArgs<ExtArgs>
  }, ExtArgs["result"]["article"]>

  export type ArticleSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    summary?: boolean
    summaryFr?: boolean
    summaryRw?: boolean
    imageUrl?: boolean
    originalLanguage?: boolean
    source?: boolean
    url?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clusterId?: boolean
  }

  export type ArticleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "summary" | "summaryFr" | "summaryRw" | "imageUrl" | "originalLanguage" | "source" | "url" | "category" | "continent" | "region" | "country" | "publishedAt" | "createdAt" | "updatedAt" | "clusterId", ExtArgs["result"]["article"]>
  export type ArticleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cluster?: boolean | Article$clusterArgs<ExtArgs>
    savedBy?: boolean | Article$savedByArgs<ExtArgs>
    readingHistory?: boolean | Article$readingHistoryArgs<ExtArgs>
    guestSaves?: boolean | Article$guestSavesArgs<ExtArgs>
    guestReadingHistory?: boolean | Article$guestReadingHistoryArgs<ExtArgs>
    _count?: boolean | ArticleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ArticleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cluster?: boolean | Article$clusterArgs<ExtArgs>
  }
  export type ArticleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cluster?: boolean | Article$clusterArgs<ExtArgs>
  }

  export type $ArticlePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Article"
    objects: {
      cluster: Prisma.$StoryClusterPayload<ExtArgs> | null
      savedBy: Prisma.$SavedArticlePayload<ExtArgs>[]
      readingHistory: Prisma.$ReadingHistoryPayload<ExtArgs>[]
      guestSaves: Prisma.$GuestSavedArticlePayload<ExtArgs>[]
      guestReadingHistory: Prisma.$GuestReadingHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      summary: string | null
      summaryFr: string | null
      summaryRw: string | null
      imageUrl: string | null
      originalLanguage: string
      source: string
      url: string
      category: string | null
      continent: string | null
      region: string | null
      country: string | null
      publishedAt: Date
      createdAt: Date
      updatedAt: Date
      /**
       * Multi-source story grouping. Null until the clustering engine assigns it.
       */
      clusterId: string | null
    }, ExtArgs["result"]["article"]>
    composites: {}
  }

  type ArticleGetPayload<S extends boolean | null | undefined | ArticleDefaultArgs> = $Result.GetResult<Prisma.$ArticlePayload, S>

  type ArticleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleCountAggregateInputType | true
    }

  export interface ArticleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Article'], meta: { name: 'Article' } }
    /**
     * Find zero or one Article that matches the filter.
     * @param {ArticleFindUniqueArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleFindUniqueArgs>(args: SelectSubset<T, ArticleFindUniqueArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Article that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleFindUniqueOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleFindFirstArgs>(args?: SelectSubset<T, ArticleFindFirstArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Article that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindFirstOrThrowArgs} args - Arguments to find a Article
     * @example
     * // Get one Article
     * const article = await prisma.article.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.article.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.article.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleWithIdOnly = await prisma.article.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleFindManyArgs>(args?: SelectSubset<T, ArticleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Article.
     * @param {ArticleCreateArgs} args - Arguments to create a Article.
     * @example
     * // Create one Article
     * const Article = await prisma.article.create({
     *   data: {
     *     // ... data to create a Article
     *   }
     * })
     * 
     */
    create<T extends ArticleCreateArgs>(args: SelectSubset<T, ArticleCreateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticleCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleCreateManyArgs>(args?: SelectSubset<T, ArticleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Articles and returns the data saved in the database.
     * @param {ArticleCreateManyAndReturnArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const article = await prisma.article.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ArticleCreateManyAndReturnArgs>(args?: SelectSubset<T, ArticleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Article.
     * @param {ArticleDeleteArgs} args - Arguments to delete one Article.
     * @example
     * // Delete one Article
     * const Article = await prisma.article.delete({
     *   where: {
     *     // ... filter to delete one Article
     *   }
     * })
     * 
     */
    delete<T extends ArticleDeleteArgs>(args: SelectSubset<T, ArticleDeleteArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Article.
     * @param {ArticleUpdateArgs} args - Arguments to update one Article.
     * @example
     * // Update one Article
     * const article = await prisma.article.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleUpdateArgs>(args: SelectSubset<T, ArticleUpdateArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticleDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.article.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleDeleteManyArgs>(args?: SelectSubset<T, ArticleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleUpdateManyArgs>(args: SelectSubset<T, ArticleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles and returns the data updated in the database.
     * @param {ArticleUpdateManyAndReturnArgs} args - Arguments to update many Articles.
     * @example
     * // Update many Articles
     * const article = await prisma.article.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Articles and only return the `id`
     * const articleWithIdOnly = await prisma.article.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ArticleUpdateManyAndReturnArgs>(args: SelectSubset<T, ArticleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Article.
     * @param {ArticleUpsertArgs} args - Arguments to update or create a Article.
     * @example
     * // Update or create a Article
     * const article = await prisma.article.upsert({
     *   create: {
     *     // ... data to create a Article
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Article we want to update
     *   }
     * })
     */
    upsert<T extends ArticleUpsertArgs>(args: SelectSubset<T, ArticleUpsertArgs<ExtArgs>>): Prisma__ArticleClient<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.article.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticleCountArgs>(
      args?: Subset<T, ArticleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ArticleAggregateArgs>(args: Subset<T, ArticleAggregateArgs>): Prisma.PrismaPromise<GetArticleAggregateType<T>>

    /**
     * Group by Article.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleGroupByArgs} args - Group by arguments.
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
      T extends ArticleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleGroupByArgs['orderBy'] }
        : { orderBy?: ArticleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Article model
   */
  readonly fields: ArticleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Article.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cluster<T extends Article$clusterArgs<ExtArgs> = {}>(args?: Subset<T, Article$clusterArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    savedBy<T extends Article$savedByArgs<ExtArgs> = {}>(args?: Subset<T, Article$savedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    readingHistory<T extends Article$readingHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Article$readingHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guestSaves<T extends Article$guestSavesArgs<ExtArgs> = {}>(args?: Subset<T, Article$guestSavesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestSavedArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    guestReadingHistory<T extends Article$guestReadingHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Article$guestReadingHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuestReadingHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Article model
   */
  interface ArticleFieldRefs {
    readonly id: FieldRef<"Article", 'String'>
    readonly title: FieldRef<"Article", 'String'>
    readonly content: FieldRef<"Article", 'String'>
    readonly summary: FieldRef<"Article", 'String'>
    readonly summaryFr: FieldRef<"Article", 'String'>
    readonly summaryRw: FieldRef<"Article", 'String'>
    readonly imageUrl: FieldRef<"Article", 'String'>
    readonly originalLanguage: FieldRef<"Article", 'String'>
    readonly source: FieldRef<"Article", 'String'>
    readonly url: FieldRef<"Article", 'String'>
    readonly category: FieldRef<"Article", 'String'>
    readonly continent: FieldRef<"Article", 'String'>
    readonly region: FieldRef<"Article", 'String'>
    readonly country: FieldRef<"Article", 'String'>
    readonly publishedAt: FieldRef<"Article", 'DateTime'>
    readonly createdAt: FieldRef<"Article", 'DateTime'>
    readonly updatedAt: FieldRef<"Article", 'DateTime'>
    readonly clusterId: FieldRef<"Article", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Article findUnique
   */
  export type ArticleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findUniqueOrThrow
   */
  export type ArticleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article findFirst
   */
  export type ArticleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findFirstOrThrow
   */
  export type ArticleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Article to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article findMany
   */
  export type ArticleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * Article create
   */
  export type ArticleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to create a Article.
     */
    data: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
  }

  /**
   * Article createMany
   */
  export type ArticleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Article createManyAndReturn
   */
  export type ArticleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to create many Articles.
     */
    data: ArticleCreateManyInput | ArticleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article update
   */
  export type ArticleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The data needed to update a Article.
     */
    data: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
    /**
     * Choose, which Article to update.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article updateMany
   */
  export type ArticleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Article updateManyAndReturn
   */
  export type ArticleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Article upsert
   */
  export type ArticleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * The filter to search for the Article to update in case it exists.
     */
    where: ArticleWhereUniqueInput
    /**
     * In case the Article found by the `where` argument doesn't exist, create a new Article with this data.
     */
    create: XOR<ArticleCreateInput, ArticleUncheckedCreateInput>
    /**
     * In case the Article was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleUpdateInput, ArticleUncheckedUpdateInput>
  }

  /**
   * Article delete
   */
  export type ArticleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    /**
     * Filter which Article to delete.
     */
    where: ArticleWhereUniqueInput
  }

  /**
   * Article deleteMany
   */
  export type ArticleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticleWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Article.cluster
   */
  export type Article$clusterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    where?: StoryClusterWhereInput
  }

  /**
   * Article.savedBy
   */
  export type Article$savedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedArticle
     */
    select?: SavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedArticle
     */
    omit?: SavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SavedArticleInclude<ExtArgs> | null
    where?: SavedArticleWhereInput
    orderBy?: SavedArticleOrderByWithRelationInput | SavedArticleOrderByWithRelationInput[]
    cursor?: SavedArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SavedArticleScalarFieldEnum | SavedArticleScalarFieldEnum[]
  }

  /**
   * Article.readingHistory
   */
  export type Article$readingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingHistory
     */
    select?: ReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingHistory
     */
    omit?: ReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReadingHistoryInclude<ExtArgs> | null
    where?: ReadingHistoryWhereInput
    orderBy?: ReadingHistoryOrderByWithRelationInput | ReadingHistoryOrderByWithRelationInput[]
    cursor?: ReadingHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReadingHistoryScalarFieldEnum | ReadingHistoryScalarFieldEnum[]
  }

  /**
   * Article.guestSaves
   */
  export type Article$guestSavesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestSavedArticle
     */
    select?: GuestSavedArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestSavedArticle
     */
    omit?: GuestSavedArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestSavedArticleInclude<ExtArgs> | null
    where?: GuestSavedArticleWhereInput
    orderBy?: GuestSavedArticleOrderByWithRelationInput | GuestSavedArticleOrderByWithRelationInput[]
    cursor?: GuestSavedArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuestSavedArticleScalarFieldEnum | GuestSavedArticleScalarFieldEnum[]
  }

  /**
   * Article.guestReadingHistory
   */
  export type Article$guestReadingHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuestReadingHistory
     */
    select?: GuestReadingHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the GuestReadingHistory
     */
    omit?: GuestReadingHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuestReadingHistoryInclude<ExtArgs> | null
    where?: GuestReadingHistoryWhereInput
    orderBy?: GuestReadingHistoryOrderByWithRelationInput | GuestReadingHistoryOrderByWithRelationInput[]
    cursor?: GuestReadingHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GuestReadingHistoryScalarFieldEnum | GuestReadingHistoryScalarFieldEnum[]
  }

  /**
   * Article without action
   */
  export type ArticleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
  }


  /**
   * Model StoryCluster
   */

  export type AggregateStoryCluster = {
    _count: StoryClusterCountAggregateOutputType | null
    _avg: StoryClusterAvgAggregateOutputType | null
    _sum: StoryClusterSumAggregateOutputType | null
    _min: StoryClusterMinAggregateOutputType | null
    _max: StoryClusterMaxAggregateOutputType | null
  }

  export type StoryClusterAvgAggregateOutputType = {
    sourceCount: number | null
    articleCount: number | null
  }

  export type StoryClusterSumAggregateOutputType = {
    sourceCount: number | null
    articleCount: number | null
  }

  export type StoryClusterMinAggregateOutputType = {
    id: string | null
    canonicalTitle: string | null
    canonicalSummary: string | null
    imageUrl: string | null
    category: string | null
    continent: string | null
    region: string | null
    country: string | null
    language: string | null
    sourceCount: number | null
    articleCount: number | null
    leadArticleId: string | null
    latestPublishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoryClusterMaxAggregateOutputType = {
    id: string | null
    canonicalTitle: string | null
    canonicalSummary: string | null
    imageUrl: string | null
    category: string | null
    continent: string | null
    region: string | null
    country: string | null
    language: string | null
    sourceCount: number | null
    articleCount: number | null
    leadArticleId: string | null
    latestPublishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoryClusterCountAggregateOutputType = {
    id: number
    canonicalTitle: number
    canonicalSummary: number
    imageUrl: number
    category: number
    continent: number
    region: number
    country: number
    language: number
    entityKeys: number
    titleTokens: number
    sourceCount: number
    articleCount: number
    languages: number
    leadArticleId: number
    latestPublishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StoryClusterAvgAggregateInputType = {
    sourceCount?: true
    articleCount?: true
  }

  export type StoryClusterSumAggregateInputType = {
    sourceCount?: true
    articleCount?: true
  }

  export type StoryClusterMinAggregateInputType = {
    id?: true
    canonicalTitle?: true
    canonicalSummary?: true
    imageUrl?: true
    category?: true
    continent?: true
    region?: true
    country?: true
    language?: true
    sourceCount?: true
    articleCount?: true
    leadArticleId?: true
    latestPublishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoryClusterMaxAggregateInputType = {
    id?: true
    canonicalTitle?: true
    canonicalSummary?: true
    imageUrl?: true
    category?: true
    continent?: true
    region?: true
    country?: true
    language?: true
    sourceCount?: true
    articleCount?: true
    leadArticleId?: true
    latestPublishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoryClusterCountAggregateInputType = {
    id?: true
    canonicalTitle?: true
    canonicalSummary?: true
    imageUrl?: true
    category?: true
    continent?: true
    region?: true
    country?: true
    language?: true
    entityKeys?: true
    titleTokens?: true
    sourceCount?: true
    articleCount?: true
    languages?: true
    leadArticleId?: true
    latestPublishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StoryClusterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoryCluster to aggregate.
     */
    where?: StoryClusterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryClusters to fetch.
     */
    orderBy?: StoryClusterOrderByWithRelationInput | StoryClusterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoryClusterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryClusters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryClusters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StoryClusters
    **/
    _count?: true | StoryClusterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoryClusterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoryClusterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoryClusterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoryClusterMaxAggregateInputType
  }

  export type GetStoryClusterAggregateType<T extends StoryClusterAggregateArgs> = {
        [P in keyof T & keyof AggregateStoryCluster]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoryCluster[P]>
      : GetScalarType<T[P], AggregateStoryCluster[P]>
  }




  export type StoryClusterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoryClusterWhereInput
    orderBy?: StoryClusterOrderByWithAggregationInput | StoryClusterOrderByWithAggregationInput[]
    by: StoryClusterScalarFieldEnum[] | StoryClusterScalarFieldEnum
    having?: StoryClusterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoryClusterCountAggregateInputType | true
    _avg?: StoryClusterAvgAggregateInputType
    _sum?: StoryClusterSumAggregateInputType
    _min?: StoryClusterMinAggregateInputType
    _max?: StoryClusterMaxAggregateInputType
  }

  export type StoryClusterGroupByOutputType = {
    id: string
    canonicalTitle: string
    canonicalSummary: string | null
    imageUrl: string | null
    category: string | null
    continent: string | null
    region: string | null
    country: string | null
    language: string
    entityKeys: string[]
    titleTokens: string[]
    sourceCount: number
    articleCount: number
    languages: string[]
    leadArticleId: string | null
    latestPublishedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: StoryClusterCountAggregateOutputType | null
    _avg: StoryClusterAvgAggregateOutputType | null
    _sum: StoryClusterSumAggregateOutputType | null
    _min: StoryClusterMinAggregateOutputType | null
    _max: StoryClusterMaxAggregateOutputType | null
  }

  type GetStoryClusterGroupByPayload<T extends StoryClusterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoryClusterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoryClusterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoryClusterGroupByOutputType[P]>
            : GetScalarType<T[P], StoryClusterGroupByOutputType[P]>
        }
      >
    >


  export type StoryClusterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canonicalTitle?: boolean
    canonicalSummary?: boolean
    imageUrl?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    language?: boolean
    entityKeys?: boolean
    titleTokens?: boolean
    sourceCount?: boolean
    articleCount?: boolean
    languages?: boolean
    leadArticleId?: boolean
    latestPublishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    articles?: boolean | StoryCluster$articlesArgs<ExtArgs>
    _count?: boolean | StoryClusterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storyCluster"]>

  export type StoryClusterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canonicalTitle?: boolean
    canonicalSummary?: boolean
    imageUrl?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    language?: boolean
    entityKeys?: boolean
    titleTokens?: boolean
    sourceCount?: boolean
    articleCount?: boolean
    languages?: boolean
    leadArticleId?: boolean
    latestPublishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["storyCluster"]>

  export type StoryClusterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    canonicalTitle?: boolean
    canonicalSummary?: boolean
    imageUrl?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    language?: boolean
    entityKeys?: boolean
    titleTokens?: boolean
    sourceCount?: boolean
    articleCount?: boolean
    languages?: boolean
    leadArticleId?: boolean
    latestPublishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["storyCluster"]>

  export type StoryClusterSelectScalar = {
    id?: boolean
    canonicalTitle?: boolean
    canonicalSummary?: boolean
    imageUrl?: boolean
    category?: boolean
    continent?: boolean
    region?: boolean
    country?: boolean
    language?: boolean
    entityKeys?: boolean
    titleTokens?: boolean
    sourceCount?: boolean
    articleCount?: boolean
    languages?: boolean
    leadArticleId?: boolean
    latestPublishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StoryClusterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "canonicalTitle" | "canonicalSummary" | "imageUrl" | "category" | "continent" | "region" | "country" | "language" | "entityKeys" | "titleTokens" | "sourceCount" | "articleCount" | "languages" | "leadArticleId" | "latestPublishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["storyCluster"]>
  export type StoryClusterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | StoryCluster$articlesArgs<ExtArgs>
    _count?: boolean | StoryClusterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StoryClusterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StoryClusterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StoryClusterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StoryCluster"
    objects: {
      articles: Prisma.$ArticlePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      canonicalTitle: string
      canonicalSummary: string | null
      imageUrl: string | null
      category: string | null
      continent: string | null
      region: string | null
      country: string | null
      /**
       * Language of the cluster — grouping never crosses languages.
       */
      language: string
      /**
       * Top entities/keywords used for bounded candidate retrieval (GIN-indexed).
       */
      entityKeys: string[]
      /**
       * Normalized title tokens used for similarity scoring.
       */
      titleTokens: string[]
      /**
       * Distinct source count (BBC, CNN, …).
       */
      sourceCount: number
      articleCount: number
      /**
       * Languages present among member articles (variants).
       */
      languages: string[]
      /**
       * Canonical / lead source article shown as the story headline.
       */
      leadArticleId: string | null
      latestPublishedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["storyCluster"]>
    composites: {}
  }

  type StoryClusterGetPayload<S extends boolean | null | undefined | StoryClusterDefaultArgs> = $Result.GetResult<Prisma.$StoryClusterPayload, S>

  type StoryClusterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoryClusterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoryClusterCountAggregateInputType | true
    }

  export interface StoryClusterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StoryCluster'], meta: { name: 'StoryCluster' } }
    /**
     * Find zero or one StoryCluster that matches the filter.
     * @param {StoryClusterFindUniqueArgs} args - Arguments to find a StoryCluster
     * @example
     * // Get one StoryCluster
     * const storyCluster = await prisma.storyCluster.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoryClusterFindUniqueArgs>(args: SelectSubset<T, StoryClusterFindUniqueArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StoryCluster that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoryClusterFindUniqueOrThrowArgs} args - Arguments to find a StoryCluster
     * @example
     * // Get one StoryCluster
     * const storyCluster = await prisma.storyCluster.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoryClusterFindUniqueOrThrowArgs>(args: SelectSubset<T, StoryClusterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoryCluster that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterFindFirstArgs} args - Arguments to find a StoryCluster
     * @example
     * // Get one StoryCluster
     * const storyCluster = await prisma.storyCluster.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoryClusterFindFirstArgs>(args?: SelectSubset<T, StoryClusterFindFirstArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoryCluster that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterFindFirstOrThrowArgs} args - Arguments to find a StoryCluster
     * @example
     * // Get one StoryCluster
     * const storyCluster = await prisma.storyCluster.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoryClusterFindFirstOrThrowArgs>(args?: SelectSubset<T, StoryClusterFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StoryClusters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StoryClusters
     * const storyClusters = await prisma.storyCluster.findMany()
     * 
     * // Get first 10 StoryClusters
     * const storyClusters = await prisma.storyCluster.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storyClusterWithIdOnly = await prisma.storyCluster.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoryClusterFindManyArgs>(args?: SelectSubset<T, StoryClusterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StoryCluster.
     * @param {StoryClusterCreateArgs} args - Arguments to create a StoryCluster.
     * @example
     * // Create one StoryCluster
     * const StoryCluster = await prisma.storyCluster.create({
     *   data: {
     *     // ... data to create a StoryCluster
     *   }
     * })
     * 
     */
    create<T extends StoryClusterCreateArgs>(args: SelectSubset<T, StoryClusterCreateArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StoryClusters.
     * @param {StoryClusterCreateManyArgs} args - Arguments to create many StoryClusters.
     * @example
     * // Create many StoryClusters
     * const storyCluster = await prisma.storyCluster.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoryClusterCreateManyArgs>(args?: SelectSubset<T, StoryClusterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StoryClusters and returns the data saved in the database.
     * @param {StoryClusterCreateManyAndReturnArgs} args - Arguments to create many StoryClusters.
     * @example
     * // Create many StoryClusters
     * const storyCluster = await prisma.storyCluster.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StoryClusters and only return the `id`
     * const storyClusterWithIdOnly = await prisma.storyCluster.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoryClusterCreateManyAndReturnArgs>(args?: SelectSubset<T, StoryClusterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StoryCluster.
     * @param {StoryClusterDeleteArgs} args - Arguments to delete one StoryCluster.
     * @example
     * // Delete one StoryCluster
     * const StoryCluster = await prisma.storyCluster.delete({
     *   where: {
     *     // ... filter to delete one StoryCluster
     *   }
     * })
     * 
     */
    delete<T extends StoryClusterDeleteArgs>(args: SelectSubset<T, StoryClusterDeleteArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StoryCluster.
     * @param {StoryClusterUpdateArgs} args - Arguments to update one StoryCluster.
     * @example
     * // Update one StoryCluster
     * const storyCluster = await prisma.storyCluster.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoryClusterUpdateArgs>(args: SelectSubset<T, StoryClusterUpdateArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StoryClusters.
     * @param {StoryClusterDeleteManyArgs} args - Arguments to filter StoryClusters to delete.
     * @example
     * // Delete a few StoryClusters
     * const { count } = await prisma.storyCluster.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoryClusterDeleteManyArgs>(args?: SelectSubset<T, StoryClusterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoryClusters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StoryClusters
     * const storyCluster = await prisma.storyCluster.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoryClusterUpdateManyArgs>(args: SelectSubset<T, StoryClusterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoryClusters and returns the data updated in the database.
     * @param {StoryClusterUpdateManyAndReturnArgs} args - Arguments to update many StoryClusters.
     * @example
     * // Update many StoryClusters
     * const storyCluster = await prisma.storyCluster.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StoryClusters and only return the `id`
     * const storyClusterWithIdOnly = await prisma.storyCluster.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StoryClusterUpdateManyAndReturnArgs>(args: SelectSubset<T, StoryClusterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StoryCluster.
     * @param {StoryClusterUpsertArgs} args - Arguments to update or create a StoryCluster.
     * @example
     * // Update or create a StoryCluster
     * const storyCluster = await prisma.storyCluster.upsert({
     *   create: {
     *     // ... data to create a StoryCluster
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StoryCluster we want to update
     *   }
     * })
     */
    upsert<T extends StoryClusterUpsertArgs>(args: SelectSubset<T, StoryClusterUpsertArgs<ExtArgs>>): Prisma__StoryClusterClient<$Result.GetResult<Prisma.$StoryClusterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StoryClusters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterCountArgs} args - Arguments to filter StoryClusters to count.
     * @example
     * // Count the number of StoryClusters
     * const count = await prisma.storyCluster.count({
     *   where: {
     *     // ... the filter for the StoryClusters we want to count
     *   }
     * })
    **/
    count<T extends StoryClusterCountArgs>(
      args?: Subset<T, StoryClusterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoryClusterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StoryCluster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StoryClusterAggregateArgs>(args: Subset<T, StoryClusterAggregateArgs>): Prisma.PrismaPromise<GetStoryClusterAggregateType<T>>

    /**
     * Group by StoryCluster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryClusterGroupByArgs} args - Group by arguments.
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
      T extends StoryClusterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoryClusterGroupByArgs['orderBy'] }
        : { orderBy?: StoryClusterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
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
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoryClusterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoryClusterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StoryCluster model
   */
  readonly fields: StoryClusterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StoryCluster.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoryClusterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    articles<T extends StoryCluster$articlesArgs<ExtArgs> = {}>(args?: Subset<T, StoryCluster$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StoryCluster model
   */
  interface StoryClusterFieldRefs {
    readonly id: FieldRef<"StoryCluster", 'String'>
    readonly canonicalTitle: FieldRef<"StoryCluster", 'String'>
    readonly canonicalSummary: FieldRef<"StoryCluster", 'String'>
    readonly imageUrl: FieldRef<"StoryCluster", 'String'>
    readonly category: FieldRef<"StoryCluster", 'String'>
    readonly continent: FieldRef<"StoryCluster", 'String'>
    readonly region: FieldRef<"StoryCluster", 'String'>
    readonly country: FieldRef<"StoryCluster", 'String'>
    readonly language: FieldRef<"StoryCluster", 'String'>
    readonly entityKeys: FieldRef<"StoryCluster", 'String[]'>
    readonly titleTokens: FieldRef<"StoryCluster", 'String[]'>
    readonly sourceCount: FieldRef<"StoryCluster", 'Int'>
    readonly articleCount: FieldRef<"StoryCluster", 'Int'>
    readonly languages: FieldRef<"StoryCluster", 'String[]'>
    readonly leadArticleId: FieldRef<"StoryCluster", 'String'>
    readonly latestPublishedAt: FieldRef<"StoryCluster", 'DateTime'>
    readonly createdAt: FieldRef<"StoryCluster", 'DateTime'>
    readonly updatedAt: FieldRef<"StoryCluster", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StoryCluster findUnique
   */
  export type StoryClusterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * Filter, which StoryCluster to fetch.
     */
    where: StoryClusterWhereUniqueInput
  }

  /**
   * StoryCluster findUniqueOrThrow
   */
  export type StoryClusterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * Filter, which StoryCluster to fetch.
     */
    where: StoryClusterWhereUniqueInput
  }

  /**
   * StoryCluster findFirst
   */
  export type StoryClusterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * Filter, which StoryCluster to fetch.
     */
    where?: StoryClusterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryClusters to fetch.
     */
    orderBy?: StoryClusterOrderByWithRelationInput | StoryClusterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoryClusters.
     */
    cursor?: StoryClusterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryClusters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryClusters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoryClusters.
     */
    distinct?: StoryClusterScalarFieldEnum | StoryClusterScalarFieldEnum[]
  }

  /**
   * StoryCluster findFirstOrThrow
   */
  export type StoryClusterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * Filter, which StoryCluster to fetch.
     */
    where?: StoryClusterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryClusters to fetch.
     */
    orderBy?: StoryClusterOrderByWithRelationInput | StoryClusterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoryClusters.
     */
    cursor?: StoryClusterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryClusters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryClusters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoryClusters.
     */
    distinct?: StoryClusterScalarFieldEnum | StoryClusterScalarFieldEnum[]
  }

  /**
   * StoryCluster findMany
   */
  export type StoryClusterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * Filter, which StoryClusters to fetch.
     */
    where?: StoryClusterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryClusters to fetch.
     */
    orderBy?: StoryClusterOrderByWithRelationInput | StoryClusterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StoryClusters.
     */
    cursor?: StoryClusterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryClusters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryClusters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoryClusters.
     */
    distinct?: StoryClusterScalarFieldEnum | StoryClusterScalarFieldEnum[]
  }

  /**
   * StoryCluster create
   */
  export type StoryClusterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * The data needed to create a StoryCluster.
     */
    data: XOR<StoryClusterCreateInput, StoryClusterUncheckedCreateInput>
  }

  /**
   * StoryCluster createMany
   */
  export type StoryClusterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StoryClusters.
     */
    data: StoryClusterCreateManyInput | StoryClusterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StoryCluster createManyAndReturn
   */
  export type StoryClusterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * The data used to create many StoryClusters.
     */
    data: StoryClusterCreateManyInput | StoryClusterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StoryCluster update
   */
  export type StoryClusterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * The data needed to update a StoryCluster.
     */
    data: XOR<StoryClusterUpdateInput, StoryClusterUncheckedUpdateInput>
    /**
     * Choose, which StoryCluster to update.
     */
    where: StoryClusterWhereUniqueInput
  }

  /**
   * StoryCluster updateMany
   */
  export type StoryClusterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StoryClusters.
     */
    data: XOR<StoryClusterUpdateManyMutationInput, StoryClusterUncheckedUpdateManyInput>
    /**
     * Filter which StoryClusters to update
     */
    where?: StoryClusterWhereInput
    /**
     * Limit how many StoryClusters to update.
     */
    limit?: number
  }

  /**
   * StoryCluster updateManyAndReturn
   */
  export type StoryClusterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * The data used to update StoryClusters.
     */
    data: XOR<StoryClusterUpdateManyMutationInput, StoryClusterUncheckedUpdateManyInput>
    /**
     * Filter which StoryClusters to update
     */
    where?: StoryClusterWhereInput
    /**
     * Limit how many StoryClusters to update.
     */
    limit?: number
  }

  /**
   * StoryCluster upsert
   */
  export type StoryClusterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * The filter to search for the StoryCluster to update in case it exists.
     */
    where: StoryClusterWhereUniqueInput
    /**
     * In case the StoryCluster found by the `where` argument doesn't exist, create a new StoryCluster with this data.
     */
    create: XOR<StoryClusterCreateInput, StoryClusterUncheckedCreateInput>
    /**
     * In case the StoryCluster was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoryClusterUpdateInput, StoryClusterUncheckedUpdateInput>
  }

  /**
   * StoryCluster delete
   */
  export type StoryClusterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
    /**
     * Filter which StoryCluster to delete.
     */
    where: StoryClusterWhereUniqueInput
  }

  /**
   * StoryCluster deleteMany
   */
  export type StoryClusterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoryClusters to delete
     */
    where?: StoryClusterWhereInput
    /**
     * Limit how many StoryClusters to delete.
     */
    limit?: number
  }

  /**
   * StoryCluster.articles
   */
  export type StoryCluster$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Article
     */
    select?: ArticleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Article
     */
    omit?: ArticleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleInclude<ExtArgs> | null
    where?: ArticleWhereInput
    orderBy?: ArticleOrderByWithRelationInput | ArticleOrderByWithRelationInput[]
    cursor?: ArticleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleScalarFieldEnum | ArticleScalarFieldEnum[]
  }

  /**
   * StoryCluster without action
   */
  export type StoryClusterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryCluster
     */
    select?: StoryClusterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryCluster
     */
    omit?: StoryClusterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryClusterInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatarUrl: 'avatarUrl',
    preferredLanguage: 'preferredLanguage',
    favoriteTopics: 'favoriteTopics',
    dailyDigest: 'dailyDigest',
    breakingNews: 'breakingNews',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OAuthAccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OAuthAccountScalarFieldEnum = (typeof OAuthAccountScalarFieldEnum)[keyof typeof OAuthAccountScalarFieldEnum]


  export const GuestSessionScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type GuestSessionScalarFieldEnum = (typeof GuestSessionScalarFieldEnum)[keyof typeof GuestSessionScalarFieldEnum]


  export const GuestSavedArticleScalarFieldEnum: {
    id: 'id',
    guestSessionId: 'guestSessionId',
    articleId: 'articleId',
    savedAt: 'savedAt'
  };

  export type GuestSavedArticleScalarFieldEnum = (typeof GuestSavedArticleScalarFieldEnum)[keyof typeof GuestSavedArticleScalarFieldEnum]


  export const GuestReadingHistoryScalarFieldEnum: {
    id: 'id',
    guestSessionId: 'guestSessionId',
    articleId: 'articleId',
    readAt: 'readAt'
  };

  export type GuestReadingHistoryScalarFieldEnum = (typeof GuestReadingHistoryScalarFieldEnum)[keyof typeof GuestReadingHistoryScalarFieldEnum]


  export const SavedArticleScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    articleId: 'articleId',
    savedAt: 'savedAt'
  };

  export type SavedArticleScalarFieldEnum = (typeof SavedArticleScalarFieldEnum)[keyof typeof SavedArticleScalarFieldEnum]


  export const ReadingHistoryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    articleId: 'articleId',
    readAt: 'readAt'
  };

  export type ReadingHistoryScalarFieldEnum = (typeof ReadingHistoryScalarFieldEnum)[keyof typeof ReadingHistoryScalarFieldEnum]


  export const ArticleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    summary: 'summary',
    summaryFr: 'summaryFr',
    summaryRw: 'summaryRw',
    imageUrl: 'imageUrl',
    originalLanguage: 'originalLanguage',
    source: 'source',
    url: 'url',
    category: 'category',
    continent: 'continent',
    region: 'region',
    country: 'country',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    clusterId: 'clusterId'
  };

  export type ArticleScalarFieldEnum = (typeof ArticleScalarFieldEnum)[keyof typeof ArticleScalarFieldEnum]


  export const StoryClusterScalarFieldEnum: {
    id: 'id',
    canonicalTitle: 'canonicalTitle',
    canonicalSummary: 'canonicalSummary',
    imageUrl: 'imageUrl',
    category: 'category',
    continent: 'continent',
    region: 'region',
    country: 'country',
    language: 'language',
    entityKeys: 'entityKeys',
    titleTokens: 'titleTokens',
    sourceCount: 'sourceCount',
    articleCount: 'articleCount',
    languages: 'languages',
    leadArticleId: 'leadArticleId',
    latestPublishedAt: 'latestPublishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StoryClusterScalarFieldEnum = (typeof StoryClusterScalarFieldEnum)[keyof typeof StoryClusterScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'AppLocale'
   */
  export type EnumAppLocaleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppLocale'>
    


  /**
   * Reference to a field of type 'AppLocale[]'
   */
  export type ListEnumAppLocaleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppLocale[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'AuthProvider'
   */
  export type EnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider'>
    


  /**
   * Reference to a field of type 'AuthProvider[]'
   */
  export type ListEnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    preferredLanguage?: EnumAppLocaleFilter<"User"> | $Enums.AppLocale
    favoriteTopics?: StringNullableListFilter<"User">
    dailyDigest?: BoolFilter<"User"> | boolean
    breakingNews?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    savedArticles?: SavedArticleListRelationFilter
    readingHistory?: ReadingHistoryListRelationFilter
    oauthAccounts?: OAuthAccountListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrder
    favoriteTopics?: SortOrder
    dailyDigest?: SortOrder
    breakingNews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    savedArticles?: SavedArticleOrderByRelationAggregateInput
    readingHistory?: ReadingHistoryOrderByRelationAggregateInput
    oauthAccounts?: OAuthAccountOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    preferredLanguage?: EnumAppLocaleFilter<"User"> | $Enums.AppLocale
    favoriteTopics?: StringNullableListFilter<"User">
    dailyDigest?: BoolFilter<"User"> | boolean
    breakingNews?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    savedArticles?: SavedArticleListRelationFilter
    readingHistory?: ReadingHistoryListRelationFilter
    oauthAccounts?: OAuthAccountListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrder
    favoriteTopics?: SortOrder
    dailyDigest?: SortOrder
    breakingNews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    preferredLanguage?: EnumAppLocaleWithAggregatesFilter<"User"> | $Enums.AppLocale
    favoriteTopics?: StringNullableListFilter<"User">
    dailyDigest?: BoolWithAggregatesFilter<"User"> | boolean
    breakingNews?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type OAuthAccountWhereInput = {
    AND?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    OR?: OAuthAccountWhereInput[]
    NOT?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    id?: StringFilter<"OAuthAccount"> | string
    userId?: StringFilter<"OAuthAccount"> | string
    provider?: EnumAuthProviderFilter<"OAuthAccount"> | $Enums.AuthProvider
    providerAccountId?: StringFilter<"OAuthAccount"> | string
    createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    updatedAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OAuthAccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type OAuthAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: OAuthAccountProviderProviderAccountIdCompoundUniqueInput
    AND?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    OR?: OAuthAccountWhereInput[]
    NOT?: OAuthAccountWhereInput | OAuthAccountWhereInput[]
    userId?: StringFilter<"OAuthAccount"> | string
    provider?: EnumAuthProviderFilter<"OAuthAccount"> | $Enums.AuthProvider
    providerAccountId?: StringFilter<"OAuthAccount"> | string
    createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    updatedAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type OAuthAccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OAuthAccountCountOrderByAggregateInput
    _max?: OAuthAccountMaxOrderByAggregateInput
    _min?: OAuthAccountMinOrderByAggregateInput
  }

  export type OAuthAccountScalarWhereWithAggregatesInput = {
    AND?: OAuthAccountScalarWhereWithAggregatesInput | OAuthAccountScalarWhereWithAggregatesInput[]
    OR?: OAuthAccountScalarWhereWithAggregatesInput[]
    NOT?: OAuthAccountScalarWhereWithAggregatesInput | OAuthAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OAuthAccount"> | string
    userId?: StringWithAggregatesFilter<"OAuthAccount"> | string
    provider?: EnumAuthProviderWithAggregatesFilter<"OAuthAccount"> | $Enums.AuthProvider
    providerAccountId?: StringWithAggregatesFilter<"OAuthAccount"> | string
    createdAt?: DateTimeWithAggregatesFilter<"OAuthAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OAuthAccount"> | Date | string
  }

  export type GuestSessionWhereInput = {
    AND?: GuestSessionWhereInput | GuestSessionWhereInput[]
    OR?: GuestSessionWhereInput[]
    NOT?: GuestSessionWhereInput | GuestSessionWhereInput[]
    id?: StringFilter<"GuestSession"> | string
    createdAt?: DateTimeFilter<"GuestSession"> | Date | string
    expiresAt?: DateTimeNullableFilter<"GuestSession"> | Date | string | null
    savedArticles?: GuestSavedArticleListRelationFilter
    readingHistory?: GuestReadingHistoryListRelationFilter
  }

  export type GuestSessionOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    savedArticles?: GuestSavedArticleOrderByRelationAggregateInput
    readingHistory?: GuestReadingHistoryOrderByRelationAggregateInput
  }

  export type GuestSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GuestSessionWhereInput | GuestSessionWhereInput[]
    OR?: GuestSessionWhereInput[]
    NOT?: GuestSessionWhereInput | GuestSessionWhereInput[]
    createdAt?: DateTimeFilter<"GuestSession"> | Date | string
    expiresAt?: DateTimeNullableFilter<"GuestSession"> | Date | string | null
    savedArticles?: GuestSavedArticleListRelationFilter
    readingHistory?: GuestReadingHistoryListRelationFilter
  }, "id">

  export type GuestSessionOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: GuestSessionCountOrderByAggregateInput
    _max?: GuestSessionMaxOrderByAggregateInput
    _min?: GuestSessionMinOrderByAggregateInput
  }

  export type GuestSessionScalarWhereWithAggregatesInput = {
    AND?: GuestSessionScalarWhereWithAggregatesInput | GuestSessionScalarWhereWithAggregatesInput[]
    OR?: GuestSessionScalarWhereWithAggregatesInput[]
    NOT?: GuestSessionScalarWhereWithAggregatesInput | GuestSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GuestSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GuestSession"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"GuestSession"> | Date | string | null
  }

  export type GuestSavedArticleWhereInput = {
    AND?: GuestSavedArticleWhereInput | GuestSavedArticleWhereInput[]
    OR?: GuestSavedArticleWhereInput[]
    NOT?: GuestSavedArticleWhereInput | GuestSavedArticleWhereInput[]
    id?: StringFilter<"GuestSavedArticle"> | string
    guestSessionId?: StringFilter<"GuestSavedArticle"> | string
    articleId?: StringFilter<"GuestSavedArticle"> | string
    savedAt?: DateTimeFilter<"GuestSavedArticle"> | Date | string
    session?: XOR<GuestSessionScalarRelationFilter, GuestSessionWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type GuestSavedArticleOrderByWithRelationInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
    session?: GuestSessionOrderByWithRelationInput
    article?: ArticleOrderByWithRelationInput
  }

  export type GuestSavedArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    guestSessionId_articleId?: GuestSavedArticleGuestSessionIdArticleIdCompoundUniqueInput
    AND?: GuestSavedArticleWhereInput | GuestSavedArticleWhereInput[]
    OR?: GuestSavedArticleWhereInput[]
    NOT?: GuestSavedArticleWhereInput | GuestSavedArticleWhereInput[]
    guestSessionId?: StringFilter<"GuestSavedArticle"> | string
    articleId?: StringFilter<"GuestSavedArticle"> | string
    savedAt?: DateTimeFilter<"GuestSavedArticle"> | Date | string
    session?: XOR<GuestSessionScalarRelationFilter, GuestSessionWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "guestSessionId_articleId">

  export type GuestSavedArticleOrderByWithAggregationInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
    _count?: GuestSavedArticleCountOrderByAggregateInput
    _max?: GuestSavedArticleMaxOrderByAggregateInput
    _min?: GuestSavedArticleMinOrderByAggregateInput
  }

  export type GuestSavedArticleScalarWhereWithAggregatesInput = {
    AND?: GuestSavedArticleScalarWhereWithAggregatesInput | GuestSavedArticleScalarWhereWithAggregatesInput[]
    OR?: GuestSavedArticleScalarWhereWithAggregatesInput[]
    NOT?: GuestSavedArticleScalarWhereWithAggregatesInput | GuestSavedArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GuestSavedArticle"> | string
    guestSessionId?: StringWithAggregatesFilter<"GuestSavedArticle"> | string
    articleId?: StringWithAggregatesFilter<"GuestSavedArticle"> | string
    savedAt?: DateTimeWithAggregatesFilter<"GuestSavedArticle"> | Date | string
  }

  export type GuestReadingHistoryWhereInput = {
    AND?: GuestReadingHistoryWhereInput | GuestReadingHistoryWhereInput[]
    OR?: GuestReadingHistoryWhereInput[]
    NOT?: GuestReadingHistoryWhereInput | GuestReadingHistoryWhereInput[]
    id?: StringFilter<"GuestReadingHistory"> | string
    guestSessionId?: StringFilter<"GuestReadingHistory"> | string
    articleId?: StringFilter<"GuestReadingHistory"> | string
    readAt?: DateTimeFilter<"GuestReadingHistory"> | Date | string
    session?: XOR<GuestSessionScalarRelationFilter, GuestSessionWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type GuestReadingHistoryOrderByWithRelationInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
    session?: GuestSessionOrderByWithRelationInput
    article?: ArticleOrderByWithRelationInput
  }

  export type GuestReadingHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    guestSessionId_articleId?: GuestReadingHistoryGuestSessionIdArticleIdCompoundUniqueInput
    AND?: GuestReadingHistoryWhereInput | GuestReadingHistoryWhereInput[]
    OR?: GuestReadingHistoryWhereInput[]
    NOT?: GuestReadingHistoryWhereInput | GuestReadingHistoryWhereInput[]
    guestSessionId?: StringFilter<"GuestReadingHistory"> | string
    articleId?: StringFilter<"GuestReadingHistory"> | string
    readAt?: DateTimeFilter<"GuestReadingHistory"> | Date | string
    session?: XOR<GuestSessionScalarRelationFilter, GuestSessionWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "guestSessionId_articleId">

  export type GuestReadingHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
    _count?: GuestReadingHistoryCountOrderByAggregateInput
    _max?: GuestReadingHistoryMaxOrderByAggregateInput
    _min?: GuestReadingHistoryMinOrderByAggregateInput
  }

  export type GuestReadingHistoryScalarWhereWithAggregatesInput = {
    AND?: GuestReadingHistoryScalarWhereWithAggregatesInput | GuestReadingHistoryScalarWhereWithAggregatesInput[]
    OR?: GuestReadingHistoryScalarWhereWithAggregatesInput[]
    NOT?: GuestReadingHistoryScalarWhereWithAggregatesInput | GuestReadingHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GuestReadingHistory"> | string
    guestSessionId?: StringWithAggregatesFilter<"GuestReadingHistory"> | string
    articleId?: StringWithAggregatesFilter<"GuestReadingHistory"> | string
    readAt?: DateTimeWithAggregatesFilter<"GuestReadingHistory"> | Date | string
  }

  export type SavedArticleWhereInput = {
    AND?: SavedArticleWhereInput | SavedArticleWhereInput[]
    OR?: SavedArticleWhereInput[]
    NOT?: SavedArticleWhereInput | SavedArticleWhereInput[]
    id?: StringFilter<"SavedArticle"> | string
    userId?: StringFilter<"SavedArticle"> | string
    articleId?: StringFilter<"SavedArticle"> | string
    savedAt?: DateTimeFilter<"SavedArticle"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type SavedArticleOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    article?: ArticleOrderByWithRelationInput
  }

  export type SavedArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_articleId?: SavedArticleUserIdArticleIdCompoundUniqueInput
    AND?: SavedArticleWhereInput | SavedArticleWhereInput[]
    OR?: SavedArticleWhereInput[]
    NOT?: SavedArticleWhereInput | SavedArticleWhereInput[]
    userId?: StringFilter<"SavedArticle"> | string
    articleId?: StringFilter<"SavedArticle"> | string
    savedAt?: DateTimeFilter<"SavedArticle"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "userId_articleId">

  export type SavedArticleOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
    _count?: SavedArticleCountOrderByAggregateInput
    _max?: SavedArticleMaxOrderByAggregateInput
    _min?: SavedArticleMinOrderByAggregateInput
  }

  export type SavedArticleScalarWhereWithAggregatesInput = {
    AND?: SavedArticleScalarWhereWithAggregatesInput | SavedArticleScalarWhereWithAggregatesInput[]
    OR?: SavedArticleScalarWhereWithAggregatesInput[]
    NOT?: SavedArticleScalarWhereWithAggregatesInput | SavedArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SavedArticle"> | string
    userId?: StringWithAggregatesFilter<"SavedArticle"> | string
    articleId?: StringWithAggregatesFilter<"SavedArticle"> | string
    savedAt?: DateTimeWithAggregatesFilter<"SavedArticle"> | Date | string
  }

  export type ReadingHistoryWhereInput = {
    AND?: ReadingHistoryWhereInput | ReadingHistoryWhereInput[]
    OR?: ReadingHistoryWhereInput[]
    NOT?: ReadingHistoryWhereInput | ReadingHistoryWhereInput[]
    id?: StringFilter<"ReadingHistory"> | string
    userId?: StringFilter<"ReadingHistory"> | string
    articleId?: StringFilter<"ReadingHistory"> | string
    readAt?: DateTimeFilter<"ReadingHistory"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }

  export type ReadingHistoryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
    user?: UserOrderByWithRelationInput
    article?: ArticleOrderByWithRelationInput
  }

  export type ReadingHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_articleId?: ReadingHistoryUserIdArticleIdCompoundUniqueInput
    AND?: ReadingHistoryWhereInput | ReadingHistoryWhereInput[]
    OR?: ReadingHistoryWhereInput[]
    NOT?: ReadingHistoryWhereInput | ReadingHistoryWhereInput[]
    userId?: StringFilter<"ReadingHistory"> | string
    articleId?: StringFilter<"ReadingHistory"> | string
    readAt?: DateTimeFilter<"ReadingHistory"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    article?: XOR<ArticleScalarRelationFilter, ArticleWhereInput>
  }, "id" | "userId_articleId">

  export type ReadingHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
    _count?: ReadingHistoryCountOrderByAggregateInput
    _max?: ReadingHistoryMaxOrderByAggregateInput
    _min?: ReadingHistoryMinOrderByAggregateInput
  }

  export type ReadingHistoryScalarWhereWithAggregatesInput = {
    AND?: ReadingHistoryScalarWhereWithAggregatesInput | ReadingHistoryScalarWhereWithAggregatesInput[]
    OR?: ReadingHistoryScalarWhereWithAggregatesInput[]
    NOT?: ReadingHistoryScalarWhereWithAggregatesInput | ReadingHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReadingHistory"> | string
    userId?: StringWithAggregatesFilter<"ReadingHistory"> | string
    articleId?: StringWithAggregatesFilter<"ReadingHistory"> | string
    readAt?: DateTimeWithAggregatesFilter<"ReadingHistory"> | Date | string
  }

  export type ArticleWhereInput = {
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    summaryFr?: StringNullableFilter<"Article"> | string | null
    summaryRw?: StringNullableFilter<"Article"> | string | null
    imageUrl?: StringNullableFilter<"Article"> | string | null
    originalLanguage?: StringFilter<"Article"> | string
    source?: StringFilter<"Article"> | string
    url?: StringFilter<"Article"> | string
    category?: StringNullableFilter<"Article"> | string | null
    continent?: StringNullableFilter<"Article"> | string | null
    region?: StringNullableFilter<"Article"> | string | null
    country?: StringNullableFilter<"Article"> | string | null
    publishedAt?: DateTimeFilter<"Article"> | Date | string
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    clusterId?: StringNullableFilter<"Article"> | string | null
    cluster?: XOR<StoryClusterNullableScalarRelationFilter, StoryClusterWhereInput> | null
    savedBy?: SavedArticleListRelationFilter
    readingHistory?: ReadingHistoryListRelationFilter
    guestSaves?: GuestSavedArticleListRelationFilter
    guestReadingHistory?: GuestReadingHistoryListRelationFilter
  }

  export type ArticleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrderInput | SortOrder
    summaryFr?: SortOrderInput | SortOrder
    summaryRw?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    originalLanguage?: SortOrder
    source?: SortOrder
    url?: SortOrder
    category?: SortOrderInput | SortOrder
    continent?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clusterId?: SortOrderInput | SortOrder
    cluster?: StoryClusterOrderByWithRelationInput
    savedBy?: SavedArticleOrderByRelationAggregateInput
    readingHistory?: ReadingHistoryOrderByRelationAggregateInput
    guestSaves?: GuestSavedArticleOrderByRelationAggregateInput
    guestReadingHistory?: GuestReadingHistoryOrderByRelationAggregateInput
  }

  export type ArticleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    url?: string
    AND?: ArticleWhereInput | ArticleWhereInput[]
    OR?: ArticleWhereInput[]
    NOT?: ArticleWhereInput | ArticleWhereInput[]
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    summaryFr?: StringNullableFilter<"Article"> | string | null
    summaryRw?: StringNullableFilter<"Article"> | string | null
    imageUrl?: StringNullableFilter<"Article"> | string | null
    originalLanguage?: StringFilter<"Article"> | string
    source?: StringFilter<"Article"> | string
    category?: StringNullableFilter<"Article"> | string | null
    continent?: StringNullableFilter<"Article"> | string | null
    region?: StringNullableFilter<"Article"> | string | null
    country?: StringNullableFilter<"Article"> | string | null
    publishedAt?: DateTimeFilter<"Article"> | Date | string
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    clusterId?: StringNullableFilter<"Article"> | string | null
    cluster?: XOR<StoryClusterNullableScalarRelationFilter, StoryClusterWhereInput> | null
    savedBy?: SavedArticleListRelationFilter
    readingHistory?: ReadingHistoryListRelationFilter
    guestSaves?: GuestSavedArticleListRelationFilter
    guestReadingHistory?: GuestReadingHistoryListRelationFilter
  }, "id" | "url">

  export type ArticleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrderInput | SortOrder
    summaryFr?: SortOrderInput | SortOrder
    summaryRw?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    originalLanguage?: SortOrder
    source?: SortOrder
    url?: SortOrder
    category?: SortOrderInput | SortOrder
    continent?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clusterId?: SortOrderInput | SortOrder
    _count?: ArticleCountOrderByAggregateInput
    _max?: ArticleMaxOrderByAggregateInput
    _min?: ArticleMinOrderByAggregateInput
  }

  export type ArticleScalarWhereWithAggregatesInput = {
    AND?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    OR?: ArticleScalarWhereWithAggregatesInput[]
    NOT?: ArticleScalarWhereWithAggregatesInput | ArticleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Article"> | string
    title?: StringWithAggregatesFilter<"Article"> | string
    content?: StringWithAggregatesFilter<"Article"> | string
    summary?: StringNullableWithAggregatesFilter<"Article"> | string | null
    summaryFr?: StringNullableWithAggregatesFilter<"Article"> | string | null
    summaryRw?: StringNullableWithAggregatesFilter<"Article"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Article"> | string | null
    originalLanguage?: StringWithAggregatesFilter<"Article"> | string
    source?: StringWithAggregatesFilter<"Article"> | string
    url?: StringWithAggregatesFilter<"Article"> | string
    category?: StringNullableWithAggregatesFilter<"Article"> | string | null
    continent?: StringNullableWithAggregatesFilter<"Article"> | string | null
    region?: StringNullableWithAggregatesFilter<"Article"> | string | null
    country?: StringNullableWithAggregatesFilter<"Article"> | string | null
    publishedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Article"> | Date | string
    clusterId?: StringNullableWithAggregatesFilter<"Article"> | string | null
  }

  export type StoryClusterWhereInput = {
    AND?: StoryClusterWhereInput | StoryClusterWhereInput[]
    OR?: StoryClusterWhereInput[]
    NOT?: StoryClusterWhereInput | StoryClusterWhereInput[]
    id?: StringFilter<"StoryCluster"> | string
    canonicalTitle?: StringFilter<"StoryCluster"> | string
    canonicalSummary?: StringNullableFilter<"StoryCluster"> | string | null
    imageUrl?: StringNullableFilter<"StoryCluster"> | string | null
    category?: StringNullableFilter<"StoryCluster"> | string | null
    continent?: StringNullableFilter<"StoryCluster"> | string | null
    region?: StringNullableFilter<"StoryCluster"> | string | null
    country?: StringNullableFilter<"StoryCluster"> | string | null
    language?: StringFilter<"StoryCluster"> | string
    entityKeys?: StringNullableListFilter<"StoryCluster">
    titleTokens?: StringNullableListFilter<"StoryCluster">
    sourceCount?: IntFilter<"StoryCluster"> | number
    articleCount?: IntFilter<"StoryCluster"> | number
    languages?: StringNullableListFilter<"StoryCluster">
    leadArticleId?: StringNullableFilter<"StoryCluster"> | string | null
    latestPublishedAt?: DateTimeFilter<"StoryCluster"> | Date | string
    createdAt?: DateTimeFilter<"StoryCluster"> | Date | string
    updatedAt?: DateTimeFilter<"StoryCluster"> | Date | string
    articles?: ArticleListRelationFilter
  }

  export type StoryClusterOrderByWithRelationInput = {
    id?: SortOrder
    canonicalTitle?: SortOrder
    canonicalSummary?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    continent?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    language?: SortOrder
    entityKeys?: SortOrder
    titleTokens?: SortOrder
    sourceCount?: SortOrder
    articleCount?: SortOrder
    languages?: SortOrder
    leadArticleId?: SortOrderInput | SortOrder
    latestPublishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    articles?: ArticleOrderByRelationAggregateInput
  }

  export type StoryClusterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StoryClusterWhereInput | StoryClusterWhereInput[]
    OR?: StoryClusterWhereInput[]
    NOT?: StoryClusterWhereInput | StoryClusterWhereInput[]
    canonicalTitle?: StringFilter<"StoryCluster"> | string
    canonicalSummary?: StringNullableFilter<"StoryCluster"> | string | null
    imageUrl?: StringNullableFilter<"StoryCluster"> | string | null
    category?: StringNullableFilter<"StoryCluster"> | string | null
    continent?: StringNullableFilter<"StoryCluster"> | string | null
    region?: StringNullableFilter<"StoryCluster"> | string | null
    country?: StringNullableFilter<"StoryCluster"> | string | null
    language?: StringFilter<"StoryCluster"> | string
    entityKeys?: StringNullableListFilter<"StoryCluster">
    titleTokens?: StringNullableListFilter<"StoryCluster">
    sourceCount?: IntFilter<"StoryCluster"> | number
    articleCount?: IntFilter<"StoryCluster"> | number
    languages?: StringNullableListFilter<"StoryCluster">
    leadArticleId?: StringNullableFilter<"StoryCluster"> | string | null
    latestPublishedAt?: DateTimeFilter<"StoryCluster"> | Date | string
    createdAt?: DateTimeFilter<"StoryCluster"> | Date | string
    updatedAt?: DateTimeFilter<"StoryCluster"> | Date | string
    articles?: ArticleListRelationFilter
  }, "id">

  export type StoryClusterOrderByWithAggregationInput = {
    id?: SortOrder
    canonicalTitle?: SortOrder
    canonicalSummary?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    continent?: SortOrderInput | SortOrder
    region?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    language?: SortOrder
    entityKeys?: SortOrder
    titleTokens?: SortOrder
    sourceCount?: SortOrder
    articleCount?: SortOrder
    languages?: SortOrder
    leadArticleId?: SortOrderInput | SortOrder
    latestPublishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StoryClusterCountOrderByAggregateInput
    _avg?: StoryClusterAvgOrderByAggregateInput
    _max?: StoryClusterMaxOrderByAggregateInput
    _min?: StoryClusterMinOrderByAggregateInput
    _sum?: StoryClusterSumOrderByAggregateInput
  }

  export type StoryClusterScalarWhereWithAggregatesInput = {
    AND?: StoryClusterScalarWhereWithAggregatesInput | StoryClusterScalarWhereWithAggregatesInput[]
    OR?: StoryClusterScalarWhereWithAggregatesInput[]
    NOT?: StoryClusterScalarWhereWithAggregatesInput | StoryClusterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StoryCluster"> | string
    canonicalTitle?: StringWithAggregatesFilter<"StoryCluster"> | string
    canonicalSummary?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    category?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    continent?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    region?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    country?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    language?: StringWithAggregatesFilter<"StoryCluster"> | string
    entityKeys?: StringNullableListFilter<"StoryCluster">
    titleTokens?: StringNullableListFilter<"StoryCluster">
    sourceCount?: IntWithAggregatesFilter<"StoryCluster"> | number
    articleCount?: IntWithAggregatesFilter<"StoryCluster"> | number
    languages?: StringNullableListFilter<"StoryCluster">
    leadArticleId?: StringNullableWithAggregatesFilter<"StoryCluster"> | string | null
    latestPublishedAt?: DateTimeWithAggregatesFilter<"StoryCluster"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"StoryCluster"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StoryCluster"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    savedArticles?: SavedArticleCreateNestedManyWithoutUserInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    savedArticles?: SavedArticleUncheckedCreateNestedManyWithoutUserInput
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedArticles?: SavedArticleUpdateManyWithoutUserNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedArticles?: SavedArticleUncheckedUpdateManyWithoutUserNestedInput
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountCreateInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOauthAccountsInput
  }

  export type OAuthAccountUncheckedCreateInput = {
    id?: string
    userId: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOauthAccountsNestedInput
  }

  export type OAuthAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountCreateManyInput = {
    id?: string
    userId: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSessionCreateInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    savedArticles?: GuestSavedArticleCreateNestedManyWithoutSessionInput
    readingHistory?: GuestReadingHistoryCreateNestedManyWithoutSessionInput
  }

  export type GuestSessionUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    savedArticles?: GuestSavedArticleUncheckedCreateNestedManyWithoutSessionInput
    readingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutSessionInput
  }

  export type GuestSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    savedArticles?: GuestSavedArticleUpdateManyWithoutSessionNestedInput
    readingHistory?: GuestReadingHistoryUpdateManyWithoutSessionNestedInput
  }

  export type GuestSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    savedArticles?: GuestSavedArticleUncheckedUpdateManyWithoutSessionNestedInput
    readingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type GuestSessionCreateManyInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type GuestSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuestSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GuestSavedArticleCreateInput = {
    id?: string
    savedAt?: Date | string
    session: GuestSessionCreateNestedOneWithoutSavedArticlesInput
    article: ArticleCreateNestedOneWithoutGuestSavesInput
  }

  export type GuestSavedArticleUncheckedCreateInput = {
    id?: string
    guestSessionId: string
    articleId: string
    savedAt?: Date | string
  }

  export type GuestSavedArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: GuestSessionUpdateOneRequiredWithoutSavedArticlesNestedInput
    article?: ArticleUpdateOneRequiredWithoutGuestSavesNestedInput
  }

  export type GuestSavedArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSavedArticleCreateManyInput = {
    id?: string
    guestSessionId: string
    articleId: string
    savedAt?: Date | string
  }

  export type GuestSavedArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSavedArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryCreateInput = {
    id?: string
    readAt?: Date | string
    session: GuestSessionCreateNestedOneWithoutReadingHistoryInput
    article: ArticleCreateNestedOneWithoutGuestReadingHistoryInput
  }

  export type GuestReadingHistoryUncheckedCreateInput = {
    id?: string
    guestSessionId: string
    articleId: string
    readAt?: Date | string
  }

  export type GuestReadingHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: GuestSessionUpdateOneRequiredWithoutReadingHistoryNestedInput
    article?: ArticleUpdateOneRequiredWithoutGuestReadingHistoryNestedInput
  }

  export type GuestReadingHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryCreateManyInput = {
    id?: string
    guestSessionId: string
    articleId: string
    readAt?: Date | string
  }

  export type GuestReadingHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleCreateInput = {
    id?: string
    savedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedArticlesInput
    article: ArticleCreateNestedOneWithoutSavedByInput
  }

  export type SavedArticleUncheckedCreateInput = {
    id?: string
    userId: string
    articleId: string
    savedAt?: Date | string
  }

  export type SavedArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedArticlesNestedInput
    article?: ArticleUpdateOneRequiredWithoutSavedByNestedInput
  }

  export type SavedArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleCreateManyInput = {
    id?: string
    userId: string
    articleId: string
    savedAt?: Date | string
  }

  export type SavedArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryCreateInput = {
    id?: string
    readAt?: Date | string
    user: UserCreateNestedOneWithoutReadingHistoryInput
    article: ArticleCreateNestedOneWithoutReadingHistoryInput
  }

  export type ReadingHistoryUncheckedCreateInput = {
    id?: string
    userId: string
    articleId: string
    readAt?: Date | string
  }

  export type ReadingHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReadingHistoryNestedInput
    article?: ArticleUpdateOneRequiredWithoutReadingHistoryNestedInput
  }

  export type ReadingHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryCreateManyInput = {
    id?: string
    userId: string
    articleId: string
    readAt?: Date | string
  }

  export type ReadingHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCreateInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    cluster?: StoryClusterCreateNestedOneWithoutArticlesInput
    savedBy?: SavedArticleCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clusterId?: string | null
    savedBy?: SavedArticleUncheckedCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleUncheckedCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cluster?: StoryClusterUpdateOneWithoutArticlesNestedInput
    savedBy?: SavedArticleUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterId?: NullableStringFieldUpdateOperationsInput | string | null
    savedBy?: SavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleCreateManyInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clusterId?: string | null
  }

  export type ArticleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StoryClusterCreateInput = {
    id?: string
    canonicalTitle: string
    canonicalSummary?: string | null
    imageUrl?: string | null
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    language?: string
    entityKeys?: StoryClusterCreateentityKeysInput | string[]
    titleTokens?: StoryClusterCreatetitleTokensInput | string[]
    sourceCount?: number
    articleCount?: number
    languages?: StoryClusterCreatelanguagesInput | string[]
    leadArticleId?: string | null
    latestPublishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    articles?: ArticleCreateNestedManyWithoutClusterInput
  }

  export type StoryClusterUncheckedCreateInput = {
    id?: string
    canonicalTitle: string
    canonicalSummary?: string | null
    imageUrl?: string | null
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    language?: string
    entityKeys?: StoryClusterCreateentityKeysInput | string[]
    titleTokens?: StoryClusterCreatetitleTokensInput | string[]
    sourceCount?: number
    articleCount?: number
    languages?: StoryClusterCreatelanguagesInput | string[]
    leadArticleId?: string | null
    latestPublishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    articles?: ArticleUncheckedCreateNestedManyWithoutClusterInput
  }

  export type StoryClusterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canonicalTitle?: StringFieldUpdateOperationsInput | string
    canonicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    entityKeys?: StoryClusterUpdateentityKeysInput | string[]
    titleTokens?: StoryClusterUpdatetitleTokensInput | string[]
    sourceCount?: IntFieldUpdateOperationsInput | number
    articleCount?: IntFieldUpdateOperationsInput | number
    languages?: StoryClusterUpdatelanguagesInput | string[]
    leadArticleId?: NullableStringFieldUpdateOperationsInput | string | null
    latestPublishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    articles?: ArticleUpdateManyWithoutClusterNestedInput
  }

  export type StoryClusterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canonicalTitle?: StringFieldUpdateOperationsInput | string
    canonicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    entityKeys?: StoryClusterUpdateentityKeysInput | string[]
    titleTokens?: StoryClusterUpdatetitleTokensInput | string[]
    sourceCount?: IntFieldUpdateOperationsInput | number
    articleCount?: IntFieldUpdateOperationsInput | number
    languages?: StoryClusterUpdatelanguagesInput | string[]
    leadArticleId?: NullableStringFieldUpdateOperationsInput | string | null
    latestPublishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    articles?: ArticleUncheckedUpdateManyWithoutClusterNestedInput
  }

  export type StoryClusterCreateManyInput = {
    id?: string
    canonicalTitle: string
    canonicalSummary?: string | null
    imageUrl?: string | null
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    language?: string
    entityKeys?: StoryClusterCreateentityKeysInput | string[]
    titleTokens?: StoryClusterCreatetitleTokensInput | string[]
    sourceCount?: number
    articleCount?: number
    languages?: StoryClusterCreatelanguagesInput | string[]
    leadArticleId?: string | null
    latestPublishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoryClusterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    canonicalTitle?: StringFieldUpdateOperationsInput | string
    canonicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    entityKeys?: StoryClusterUpdateentityKeysInput | string[]
    titleTokens?: StoryClusterUpdatetitleTokensInput | string[]
    sourceCount?: IntFieldUpdateOperationsInput | number
    articleCount?: IntFieldUpdateOperationsInput | number
    languages?: StoryClusterUpdatelanguagesInput | string[]
    leadArticleId?: NullableStringFieldUpdateOperationsInput | string | null
    latestPublishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoryClusterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    canonicalTitle?: StringFieldUpdateOperationsInput | string
    canonicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    entityKeys?: StoryClusterUpdateentityKeysInput | string[]
    titleTokens?: StoryClusterUpdatetitleTokensInput | string[]
    sourceCount?: IntFieldUpdateOperationsInput | number
    articleCount?: IntFieldUpdateOperationsInput | number
    languages?: StoryClusterUpdatelanguagesInput | string[]
    leadArticleId?: NullableStringFieldUpdateOperationsInput | string | null
    latestPublishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumAppLocaleFilter<$PrismaModel = never> = {
    equals?: $Enums.AppLocale | EnumAppLocaleFieldRefInput<$PrismaModel>
    in?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    not?: NestedEnumAppLocaleFilter<$PrismaModel> | $Enums.AppLocale
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SavedArticleListRelationFilter = {
    every?: SavedArticleWhereInput
    some?: SavedArticleWhereInput
    none?: SavedArticleWhereInput
  }

  export type ReadingHistoryListRelationFilter = {
    every?: ReadingHistoryWhereInput
    some?: ReadingHistoryWhereInput
    none?: ReadingHistoryWhereInput
  }

  export type OAuthAccountListRelationFilter = {
    every?: OAuthAccountWhereInput
    some?: OAuthAccountWhereInput
    none?: OAuthAccountWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SavedArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReadingHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OAuthAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    preferredLanguage?: SortOrder
    favoriteTopics?: SortOrder
    dailyDigest?: SortOrder
    breakingNews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    preferredLanguage?: SortOrder
    dailyDigest?: SortOrder
    breakingNews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    preferredLanguage?: SortOrder
    dailyDigest?: SortOrder
    breakingNews?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumAppLocaleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppLocale | EnumAppLocaleFieldRefInput<$PrismaModel>
    in?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    not?: NestedEnumAppLocaleWithAggregatesFilter<$PrismaModel> | $Enums.AppLocale
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppLocaleFilter<$PrismaModel>
    _max?: NestedEnumAppLocaleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type OAuthAccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: $Enums.AuthProvider
    providerAccountId: string
  }

  export type OAuthAccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OAuthAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OAuthAccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthProviderFilter<$PrismaModel>
    _max?: NestedEnumAuthProviderFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type GuestSavedArticleListRelationFilter = {
    every?: GuestSavedArticleWhereInput
    some?: GuestSavedArticleWhereInput
    none?: GuestSavedArticleWhereInput
  }

  export type GuestReadingHistoryListRelationFilter = {
    every?: GuestReadingHistoryWhereInput
    some?: GuestReadingHistoryWhereInput
    none?: GuestReadingHistoryWhereInput
  }

  export type GuestSavedArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuestReadingHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GuestSessionCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type GuestSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type GuestSessionMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type GuestSessionScalarRelationFilter = {
    is?: GuestSessionWhereInput
    isNot?: GuestSessionWhereInput
  }

  export type ArticleScalarRelationFilter = {
    is?: ArticleWhereInput
    isNot?: ArticleWhereInput
  }

  export type GuestSavedArticleGuestSessionIdArticleIdCompoundUniqueInput = {
    guestSessionId: string
    articleId: string
  }

  export type GuestSavedArticleCountOrderByAggregateInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
  }

  export type GuestSavedArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
  }

  export type GuestSavedArticleMinOrderByAggregateInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
  }

  export type GuestReadingHistoryGuestSessionIdArticleIdCompoundUniqueInput = {
    guestSessionId: string
    articleId: string
  }

  export type GuestReadingHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
  }

  export type GuestReadingHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
  }

  export type GuestReadingHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    guestSessionId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
  }

  export type SavedArticleUserIdArticleIdCompoundUniqueInput = {
    userId: string
    articleId: string
  }

  export type SavedArticleCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
  }

  export type SavedArticleMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    savedAt?: SortOrder
  }

  export type ReadingHistoryUserIdArticleIdCompoundUniqueInput = {
    userId: string
    articleId: string
  }

  export type ReadingHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
  }

  export type ReadingHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
  }

  export type ReadingHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    articleId?: SortOrder
    readAt?: SortOrder
  }

  export type StoryClusterNullableScalarRelationFilter = {
    is?: StoryClusterWhereInput | null
    isNot?: StoryClusterWhereInput | null
  }

  export type ArticleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    summaryFr?: SortOrder
    summaryRw?: SortOrder
    imageUrl?: SortOrder
    originalLanguage?: SortOrder
    source?: SortOrder
    url?: SortOrder
    category?: SortOrder
    continent?: SortOrder
    region?: SortOrder
    country?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clusterId?: SortOrder
  }

  export type ArticleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    summaryFr?: SortOrder
    summaryRw?: SortOrder
    imageUrl?: SortOrder
    originalLanguage?: SortOrder
    source?: SortOrder
    url?: SortOrder
    category?: SortOrder
    continent?: SortOrder
    region?: SortOrder
    country?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clusterId?: SortOrder
  }

  export type ArticleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    summary?: SortOrder
    summaryFr?: SortOrder
    summaryRw?: SortOrder
    imageUrl?: SortOrder
    originalLanguage?: SortOrder
    source?: SortOrder
    url?: SortOrder
    category?: SortOrder
    continent?: SortOrder
    region?: SortOrder
    country?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clusterId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ArticleListRelationFilter = {
    every?: ArticleWhereInput
    some?: ArticleWhereInput
    none?: ArticleWhereInput
  }

  export type ArticleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoryClusterCountOrderByAggregateInput = {
    id?: SortOrder
    canonicalTitle?: SortOrder
    canonicalSummary?: SortOrder
    imageUrl?: SortOrder
    category?: SortOrder
    continent?: SortOrder
    region?: SortOrder
    country?: SortOrder
    language?: SortOrder
    entityKeys?: SortOrder
    titleTokens?: SortOrder
    sourceCount?: SortOrder
    articleCount?: SortOrder
    languages?: SortOrder
    leadArticleId?: SortOrder
    latestPublishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoryClusterAvgOrderByAggregateInput = {
    sourceCount?: SortOrder
    articleCount?: SortOrder
  }

  export type StoryClusterMaxOrderByAggregateInput = {
    id?: SortOrder
    canonicalTitle?: SortOrder
    canonicalSummary?: SortOrder
    imageUrl?: SortOrder
    category?: SortOrder
    continent?: SortOrder
    region?: SortOrder
    country?: SortOrder
    language?: SortOrder
    sourceCount?: SortOrder
    articleCount?: SortOrder
    leadArticleId?: SortOrder
    latestPublishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoryClusterMinOrderByAggregateInput = {
    id?: SortOrder
    canonicalTitle?: SortOrder
    canonicalSummary?: SortOrder
    imageUrl?: SortOrder
    category?: SortOrder
    continent?: SortOrder
    region?: SortOrder
    country?: SortOrder
    language?: SortOrder
    sourceCount?: SortOrder
    articleCount?: SortOrder
    leadArticleId?: SortOrder
    latestPublishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoryClusterSumOrderByAggregateInput = {
    sourceCount?: SortOrder
    articleCount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UserCreatefavoriteTopicsInput = {
    set: string[]
  }

  export type SavedArticleCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedArticleCreateWithoutUserInput, SavedArticleUncheckedCreateWithoutUserInput> | SavedArticleCreateWithoutUserInput[] | SavedArticleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutUserInput | SavedArticleCreateOrConnectWithoutUserInput[]
    createMany?: SavedArticleCreateManyUserInputEnvelope
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
  }

  export type ReadingHistoryCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingHistoryCreateWithoutUserInput, ReadingHistoryUncheckedCreateWithoutUserInput> | ReadingHistoryCreateWithoutUserInput[] | ReadingHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutUserInput | ReadingHistoryCreateOrConnectWithoutUserInput[]
    createMany?: ReadingHistoryCreateManyUserInputEnvelope
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
  }

  export type OAuthAccountCreateNestedManyWithoutUserInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
  }

  export type SavedArticleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SavedArticleCreateWithoutUserInput, SavedArticleUncheckedCreateWithoutUserInput> | SavedArticleCreateWithoutUserInput[] | SavedArticleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutUserInput | SavedArticleCreateOrConnectWithoutUserInput[]
    createMany?: SavedArticleCreateManyUserInputEnvelope
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
  }

  export type ReadingHistoryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReadingHistoryCreateWithoutUserInput, ReadingHistoryUncheckedCreateWithoutUserInput> | ReadingHistoryCreateWithoutUserInput[] | ReadingHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutUserInput | ReadingHistoryCreateOrConnectWithoutUserInput[]
    createMany?: ReadingHistoryCreateManyUserInputEnvelope
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
  }

  export type OAuthAccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumAppLocaleFieldUpdateOperationsInput = {
    set?: $Enums.AppLocale
  }

  export type UserUpdatefavoriteTopicsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SavedArticleUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedArticleCreateWithoutUserInput, SavedArticleUncheckedCreateWithoutUserInput> | SavedArticleCreateWithoutUserInput[] | SavedArticleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutUserInput | SavedArticleCreateOrConnectWithoutUserInput[]
    upsert?: SavedArticleUpsertWithWhereUniqueWithoutUserInput | SavedArticleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedArticleCreateManyUserInputEnvelope
    set?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    disconnect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    delete?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    update?: SavedArticleUpdateWithWhereUniqueWithoutUserInput | SavedArticleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedArticleUpdateManyWithWhereWithoutUserInput | SavedArticleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedArticleScalarWhereInput | SavedArticleScalarWhereInput[]
  }

  export type ReadingHistoryUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingHistoryCreateWithoutUserInput, ReadingHistoryUncheckedCreateWithoutUserInput> | ReadingHistoryCreateWithoutUserInput[] | ReadingHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutUserInput | ReadingHistoryCreateOrConnectWithoutUserInput[]
    upsert?: ReadingHistoryUpsertWithWhereUniqueWithoutUserInput | ReadingHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingHistoryCreateManyUserInputEnvelope
    set?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    disconnect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    delete?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    update?: ReadingHistoryUpdateWithWhereUniqueWithoutUserInput | ReadingHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingHistoryUpdateManyWithWhereWithoutUserInput | ReadingHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingHistoryScalarWhereInput | ReadingHistoryScalarWhereInput[]
  }

  export type OAuthAccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    upsert?: OAuthAccountUpsertWithWhereUniqueWithoutUserInput | OAuthAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    set?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    disconnect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    delete?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    update?: OAuthAccountUpdateWithWhereUniqueWithoutUserInput | OAuthAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OAuthAccountUpdateManyWithWhereWithoutUserInput | OAuthAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
  }

  export type SavedArticleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SavedArticleCreateWithoutUserInput, SavedArticleUncheckedCreateWithoutUserInput> | SavedArticleCreateWithoutUserInput[] | SavedArticleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutUserInput | SavedArticleCreateOrConnectWithoutUserInput[]
    upsert?: SavedArticleUpsertWithWhereUniqueWithoutUserInput | SavedArticleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SavedArticleCreateManyUserInputEnvelope
    set?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    disconnect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    delete?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    update?: SavedArticleUpdateWithWhereUniqueWithoutUserInput | SavedArticleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SavedArticleUpdateManyWithWhereWithoutUserInput | SavedArticleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SavedArticleScalarWhereInput | SavedArticleScalarWhereInput[]
  }

  export type ReadingHistoryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReadingHistoryCreateWithoutUserInput, ReadingHistoryUncheckedCreateWithoutUserInput> | ReadingHistoryCreateWithoutUserInput[] | ReadingHistoryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutUserInput | ReadingHistoryCreateOrConnectWithoutUserInput[]
    upsert?: ReadingHistoryUpsertWithWhereUniqueWithoutUserInput | ReadingHistoryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReadingHistoryCreateManyUserInputEnvelope
    set?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    disconnect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    delete?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    update?: ReadingHistoryUpdateWithWhereUniqueWithoutUserInput | ReadingHistoryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReadingHistoryUpdateManyWithWhereWithoutUserInput | ReadingHistoryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReadingHistoryScalarWhereInput | ReadingHistoryScalarWhereInput[]
  }

  export type OAuthAccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput> | OAuthAccountCreateWithoutUserInput[] | OAuthAccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OAuthAccountCreateOrConnectWithoutUserInput | OAuthAccountCreateOrConnectWithoutUserInput[]
    upsert?: OAuthAccountUpsertWithWhereUniqueWithoutUserInput | OAuthAccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OAuthAccountCreateManyUserInputEnvelope
    set?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    disconnect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    delete?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    connect?: OAuthAccountWhereUniqueInput | OAuthAccountWhereUniqueInput[]
    update?: OAuthAccountUpdateWithWhereUniqueWithoutUserInput | OAuthAccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OAuthAccountUpdateManyWithWhereWithoutUserInput | OAuthAccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOauthAccountsInput = {
    create?: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumAuthProviderFieldUpdateOperationsInput = {
    set?: $Enums.AuthProvider
  }

  export type UserUpdateOneRequiredWithoutOauthAccountsNestedInput = {
    create?: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOauthAccountsInput
    upsert?: UserUpsertWithoutOauthAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOauthAccountsInput, UserUpdateWithoutOauthAccountsInput>, UserUncheckedUpdateWithoutOauthAccountsInput>
  }

  export type GuestSavedArticleCreateNestedManyWithoutSessionInput = {
    create?: XOR<GuestSavedArticleCreateWithoutSessionInput, GuestSavedArticleUncheckedCreateWithoutSessionInput> | GuestSavedArticleCreateWithoutSessionInput[] | GuestSavedArticleUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutSessionInput | GuestSavedArticleCreateOrConnectWithoutSessionInput[]
    createMany?: GuestSavedArticleCreateManySessionInputEnvelope
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
  }

  export type GuestReadingHistoryCreateNestedManyWithoutSessionInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutSessionInput, GuestReadingHistoryUncheckedCreateWithoutSessionInput> | GuestReadingHistoryCreateWithoutSessionInput[] | GuestReadingHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutSessionInput | GuestReadingHistoryCreateOrConnectWithoutSessionInput[]
    createMany?: GuestReadingHistoryCreateManySessionInputEnvelope
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
  }

  export type GuestSavedArticleUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<GuestSavedArticleCreateWithoutSessionInput, GuestSavedArticleUncheckedCreateWithoutSessionInput> | GuestSavedArticleCreateWithoutSessionInput[] | GuestSavedArticleUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutSessionInput | GuestSavedArticleCreateOrConnectWithoutSessionInput[]
    createMany?: GuestSavedArticleCreateManySessionInputEnvelope
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
  }

  export type GuestReadingHistoryUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutSessionInput, GuestReadingHistoryUncheckedCreateWithoutSessionInput> | GuestReadingHistoryCreateWithoutSessionInput[] | GuestReadingHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutSessionInput | GuestReadingHistoryCreateOrConnectWithoutSessionInput[]
    createMany?: GuestReadingHistoryCreateManySessionInputEnvelope
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type GuestSavedArticleUpdateManyWithoutSessionNestedInput = {
    create?: XOR<GuestSavedArticleCreateWithoutSessionInput, GuestSavedArticleUncheckedCreateWithoutSessionInput> | GuestSavedArticleCreateWithoutSessionInput[] | GuestSavedArticleUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutSessionInput | GuestSavedArticleCreateOrConnectWithoutSessionInput[]
    upsert?: GuestSavedArticleUpsertWithWhereUniqueWithoutSessionInput | GuestSavedArticleUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: GuestSavedArticleCreateManySessionInputEnvelope
    set?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    disconnect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    delete?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    update?: GuestSavedArticleUpdateWithWhereUniqueWithoutSessionInput | GuestSavedArticleUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: GuestSavedArticleUpdateManyWithWhereWithoutSessionInput | GuestSavedArticleUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: GuestSavedArticleScalarWhereInput | GuestSavedArticleScalarWhereInput[]
  }

  export type GuestReadingHistoryUpdateManyWithoutSessionNestedInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutSessionInput, GuestReadingHistoryUncheckedCreateWithoutSessionInput> | GuestReadingHistoryCreateWithoutSessionInput[] | GuestReadingHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutSessionInput | GuestReadingHistoryCreateOrConnectWithoutSessionInput[]
    upsert?: GuestReadingHistoryUpsertWithWhereUniqueWithoutSessionInput | GuestReadingHistoryUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: GuestReadingHistoryCreateManySessionInputEnvelope
    set?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    disconnect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    delete?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    update?: GuestReadingHistoryUpdateWithWhereUniqueWithoutSessionInput | GuestReadingHistoryUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: GuestReadingHistoryUpdateManyWithWhereWithoutSessionInput | GuestReadingHistoryUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: GuestReadingHistoryScalarWhereInput | GuestReadingHistoryScalarWhereInput[]
  }

  export type GuestSavedArticleUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<GuestSavedArticleCreateWithoutSessionInput, GuestSavedArticleUncheckedCreateWithoutSessionInput> | GuestSavedArticleCreateWithoutSessionInput[] | GuestSavedArticleUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutSessionInput | GuestSavedArticleCreateOrConnectWithoutSessionInput[]
    upsert?: GuestSavedArticleUpsertWithWhereUniqueWithoutSessionInput | GuestSavedArticleUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: GuestSavedArticleCreateManySessionInputEnvelope
    set?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    disconnect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    delete?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    update?: GuestSavedArticleUpdateWithWhereUniqueWithoutSessionInput | GuestSavedArticleUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: GuestSavedArticleUpdateManyWithWhereWithoutSessionInput | GuestSavedArticleUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: GuestSavedArticleScalarWhereInput | GuestSavedArticleScalarWhereInput[]
  }

  export type GuestReadingHistoryUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutSessionInput, GuestReadingHistoryUncheckedCreateWithoutSessionInput> | GuestReadingHistoryCreateWithoutSessionInput[] | GuestReadingHistoryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutSessionInput | GuestReadingHistoryCreateOrConnectWithoutSessionInput[]
    upsert?: GuestReadingHistoryUpsertWithWhereUniqueWithoutSessionInput | GuestReadingHistoryUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: GuestReadingHistoryCreateManySessionInputEnvelope
    set?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    disconnect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    delete?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    update?: GuestReadingHistoryUpdateWithWhereUniqueWithoutSessionInput | GuestReadingHistoryUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: GuestReadingHistoryUpdateManyWithWhereWithoutSessionInput | GuestReadingHistoryUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: GuestReadingHistoryScalarWhereInput | GuestReadingHistoryScalarWhereInput[]
  }

  export type GuestSessionCreateNestedOneWithoutSavedArticlesInput = {
    create?: XOR<GuestSessionCreateWithoutSavedArticlesInput, GuestSessionUncheckedCreateWithoutSavedArticlesInput>
    connectOrCreate?: GuestSessionCreateOrConnectWithoutSavedArticlesInput
    connect?: GuestSessionWhereUniqueInput
  }

  export type ArticleCreateNestedOneWithoutGuestSavesInput = {
    create?: XOR<ArticleCreateWithoutGuestSavesInput, ArticleUncheckedCreateWithoutGuestSavesInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutGuestSavesInput
    connect?: ArticleWhereUniqueInput
  }

  export type GuestSessionUpdateOneRequiredWithoutSavedArticlesNestedInput = {
    create?: XOR<GuestSessionCreateWithoutSavedArticlesInput, GuestSessionUncheckedCreateWithoutSavedArticlesInput>
    connectOrCreate?: GuestSessionCreateOrConnectWithoutSavedArticlesInput
    upsert?: GuestSessionUpsertWithoutSavedArticlesInput
    connect?: GuestSessionWhereUniqueInput
    update?: XOR<XOR<GuestSessionUpdateToOneWithWhereWithoutSavedArticlesInput, GuestSessionUpdateWithoutSavedArticlesInput>, GuestSessionUncheckedUpdateWithoutSavedArticlesInput>
  }

  export type ArticleUpdateOneRequiredWithoutGuestSavesNestedInput = {
    create?: XOR<ArticleCreateWithoutGuestSavesInput, ArticleUncheckedCreateWithoutGuestSavesInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutGuestSavesInput
    upsert?: ArticleUpsertWithoutGuestSavesInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutGuestSavesInput, ArticleUpdateWithoutGuestSavesInput>, ArticleUncheckedUpdateWithoutGuestSavesInput>
  }

  export type GuestSessionCreateNestedOneWithoutReadingHistoryInput = {
    create?: XOR<GuestSessionCreateWithoutReadingHistoryInput, GuestSessionUncheckedCreateWithoutReadingHistoryInput>
    connectOrCreate?: GuestSessionCreateOrConnectWithoutReadingHistoryInput
    connect?: GuestSessionWhereUniqueInput
  }

  export type ArticleCreateNestedOneWithoutGuestReadingHistoryInput = {
    create?: XOR<ArticleCreateWithoutGuestReadingHistoryInput, ArticleUncheckedCreateWithoutGuestReadingHistoryInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutGuestReadingHistoryInput
    connect?: ArticleWhereUniqueInput
  }

  export type GuestSessionUpdateOneRequiredWithoutReadingHistoryNestedInput = {
    create?: XOR<GuestSessionCreateWithoutReadingHistoryInput, GuestSessionUncheckedCreateWithoutReadingHistoryInput>
    connectOrCreate?: GuestSessionCreateOrConnectWithoutReadingHistoryInput
    upsert?: GuestSessionUpsertWithoutReadingHistoryInput
    connect?: GuestSessionWhereUniqueInput
    update?: XOR<XOR<GuestSessionUpdateToOneWithWhereWithoutReadingHistoryInput, GuestSessionUpdateWithoutReadingHistoryInput>, GuestSessionUncheckedUpdateWithoutReadingHistoryInput>
  }

  export type ArticleUpdateOneRequiredWithoutGuestReadingHistoryNestedInput = {
    create?: XOR<ArticleCreateWithoutGuestReadingHistoryInput, ArticleUncheckedCreateWithoutGuestReadingHistoryInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutGuestReadingHistoryInput
    upsert?: ArticleUpsertWithoutGuestReadingHistoryInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutGuestReadingHistoryInput, ArticleUpdateWithoutGuestReadingHistoryInput>, ArticleUncheckedUpdateWithoutGuestReadingHistoryInput>
  }

  export type UserCreateNestedOneWithoutSavedArticlesInput = {
    create?: XOR<UserCreateWithoutSavedArticlesInput, UserUncheckedCreateWithoutSavedArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedArticlesInput
    connect?: UserWhereUniqueInput
  }

  export type ArticleCreateNestedOneWithoutSavedByInput = {
    create?: XOR<ArticleCreateWithoutSavedByInput, ArticleUncheckedCreateWithoutSavedByInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutSavedByInput
    connect?: ArticleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSavedArticlesNestedInput = {
    create?: XOR<UserCreateWithoutSavedArticlesInput, UserUncheckedCreateWithoutSavedArticlesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSavedArticlesInput
    upsert?: UserUpsertWithoutSavedArticlesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSavedArticlesInput, UserUpdateWithoutSavedArticlesInput>, UserUncheckedUpdateWithoutSavedArticlesInput>
  }

  export type ArticleUpdateOneRequiredWithoutSavedByNestedInput = {
    create?: XOR<ArticleCreateWithoutSavedByInput, ArticleUncheckedCreateWithoutSavedByInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutSavedByInput
    upsert?: ArticleUpsertWithoutSavedByInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutSavedByInput, ArticleUpdateWithoutSavedByInput>, ArticleUncheckedUpdateWithoutSavedByInput>
  }

  export type UserCreateNestedOneWithoutReadingHistoryInput = {
    create?: XOR<UserCreateWithoutReadingHistoryInput, UserUncheckedCreateWithoutReadingHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadingHistoryInput
    connect?: UserWhereUniqueInput
  }

  export type ArticleCreateNestedOneWithoutReadingHistoryInput = {
    create?: XOR<ArticleCreateWithoutReadingHistoryInput, ArticleUncheckedCreateWithoutReadingHistoryInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutReadingHistoryInput
    connect?: ArticleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutReadingHistoryNestedInput = {
    create?: XOR<UserCreateWithoutReadingHistoryInput, UserUncheckedCreateWithoutReadingHistoryInput>
    connectOrCreate?: UserCreateOrConnectWithoutReadingHistoryInput
    upsert?: UserUpsertWithoutReadingHistoryInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReadingHistoryInput, UserUpdateWithoutReadingHistoryInput>, UserUncheckedUpdateWithoutReadingHistoryInput>
  }

  export type ArticleUpdateOneRequiredWithoutReadingHistoryNestedInput = {
    create?: XOR<ArticleCreateWithoutReadingHistoryInput, ArticleUncheckedCreateWithoutReadingHistoryInput>
    connectOrCreate?: ArticleCreateOrConnectWithoutReadingHistoryInput
    upsert?: ArticleUpsertWithoutReadingHistoryInput
    connect?: ArticleWhereUniqueInput
    update?: XOR<XOR<ArticleUpdateToOneWithWhereWithoutReadingHistoryInput, ArticleUpdateWithoutReadingHistoryInput>, ArticleUncheckedUpdateWithoutReadingHistoryInput>
  }

  export type StoryClusterCreateNestedOneWithoutArticlesInput = {
    create?: XOR<StoryClusterCreateWithoutArticlesInput, StoryClusterUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: StoryClusterCreateOrConnectWithoutArticlesInput
    connect?: StoryClusterWhereUniqueInput
  }

  export type SavedArticleCreateNestedManyWithoutArticleInput = {
    create?: XOR<SavedArticleCreateWithoutArticleInput, SavedArticleUncheckedCreateWithoutArticleInput> | SavedArticleCreateWithoutArticleInput[] | SavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutArticleInput | SavedArticleCreateOrConnectWithoutArticleInput[]
    createMany?: SavedArticleCreateManyArticleInputEnvelope
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
  }

  export type ReadingHistoryCreateNestedManyWithoutArticleInput = {
    create?: XOR<ReadingHistoryCreateWithoutArticleInput, ReadingHistoryUncheckedCreateWithoutArticleInput> | ReadingHistoryCreateWithoutArticleInput[] | ReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutArticleInput | ReadingHistoryCreateOrConnectWithoutArticleInput[]
    createMany?: ReadingHistoryCreateManyArticleInputEnvelope
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
  }

  export type GuestSavedArticleCreateNestedManyWithoutArticleInput = {
    create?: XOR<GuestSavedArticleCreateWithoutArticleInput, GuestSavedArticleUncheckedCreateWithoutArticleInput> | GuestSavedArticleCreateWithoutArticleInput[] | GuestSavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutArticleInput | GuestSavedArticleCreateOrConnectWithoutArticleInput[]
    createMany?: GuestSavedArticleCreateManyArticleInputEnvelope
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
  }

  export type GuestReadingHistoryCreateNestedManyWithoutArticleInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutArticleInput, GuestReadingHistoryUncheckedCreateWithoutArticleInput> | GuestReadingHistoryCreateWithoutArticleInput[] | GuestReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutArticleInput | GuestReadingHistoryCreateOrConnectWithoutArticleInput[]
    createMany?: GuestReadingHistoryCreateManyArticleInputEnvelope
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
  }

  export type SavedArticleUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<SavedArticleCreateWithoutArticleInput, SavedArticleUncheckedCreateWithoutArticleInput> | SavedArticleCreateWithoutArticleInput[] | SavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutArticleInput | SavedArticleCreateOrConnectWithoutArticleInput[]
    createMany?: SavedArticleCreateManyArticleInputEnvelope
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
  }

  export type ReadingHistoryUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<ReadingHistoryCreateWithoutArticleInput, ReadingHistoryUncheckedCreateWithoutArticleInput> | ReadingHistoryCreateWithoutArticleInput[] | ReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutArticleInput | ReadingHistoryCreateOrConnectWithoutArticleInput[]
    createMany?: ReadingHistoryCreateManyArticleInputEnvelope
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
  }

  export type GuestSavedArticleUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<GuestSavedArticleCreateWithoutArticleInput, GuestSavedArticleUncheckedCreateWithoutArticleInput> | GuestSavedArticleCreateWithoutArticleInput[] | GuestSavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutArticleInput | GuestSavedArticleCreateOrConnectWithoutArticleInput[]
    createMany?: GuestSavedArticleCreateManyArticleInputEnvelope
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
  }

  export type GuestReadingHistoryUncheckedCreateNestedManyWithoutArticleInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutArticleInput, GuestReadingHistoryUncheckedCreateWithoutArticleInput> | GuestReadingHistoryCreateWithoutArticleInput[] | GuestReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutArticleInput | GuestReadingHistoryCreateOrConnectWithoutArticleInput[]
    createMany?: GuestReadingHistoryCreateManyArticleInputEnvelope
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
  }

  export type StoryClusterUpdateOneWithoutArticlesNestedInput = {
    create?: XOR<StoryClusterCreateWithoutArticlesInput, StoryClusterUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: StoryClusterCreateOrConnectWithoutArticlesInput
    upsert?: StoryClusterUpsertWithoutArticlesInput
    disconnect?: StoryClusterWhereInput | boolean
    delete?: StoryClusterWhereInput | boolean
    connect?: StoryClusterWhereUniqueInput
    update?: XOR<XOR<StoryClusterUpdateToOneWithWhereWithoutArticlesInput, StoryClusterUpdateWithoutArticlesInput>, StoryClusterUncheckedUpdateWithoutArticlesInput>
  }

  export type SavedArticleUpdateManyWithoutArticleNestedInput = {
    create?: XOR<SavedArticleCreateWithoutArticleInput, SavedArticleUncheckedCreateWithoutArticleInput> | SavedArticleCreateWithoutArticleInput[] | SavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutArticleInput | SavedArticleCreateOrConnectWithoutArticleInput[]
    upsert?: SavedArticleUpsertWithWhereUniqueWithoutArticleInput | SavedArticleUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: SavedArticleCreateManyArticleInputEnvelope
    set?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    disconnect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    delete?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    update?: SavedArticleUpdateWithWhereUniqueWithoutArticleInput | SavedArticleUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: SavedArticleUpdateManyWithWhereWithoutArticleInput | SavedArticleUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: SavedArticleScalarWhereInput | SavedArticleScalarWhereInput[]
  }

  export type ReadingHistoryUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ReadingHistoryCreateWithoutArticleInput, ReadingHistoryUncheckedCreateWithoutArticleInput> | ReadingHistoryCreateWithoutArticleInput[] | ReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutArticleInput | ReadingHistoryCreateOrConnectWithoutArticleInput[]
    upsert?: ReadingHistoryUpsertWithWhereUniqueWithoutArticleInput | ReadingHistoryUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ReadingHistoryCreateManyArticleInputEnvelope
    set?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    disconnect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    delete?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    update?: ReadingHistoryUpdateWithWhereUniqueWithoutArticleInput | ReadingHistoryUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ReadingHistoryUpdateManyWithWhereWithoutArticleInput | ReadingHistoryUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ReadingHistoryScalarWhereInput | ReadingHistoryScalarWhereInput[]
  }

  export type GuestSavedArticleUpdateManyWithoutArticleNestedInput = {
    create?: XOR<GuestSavedArticleCreateWithoutArticleInput, GuestSavedArticleUncheckedCreateWithoutArticleInput> | GuestSavedArticleCreateWithoutArticleInput[] | GuestSavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutArticleInput | GuestSavedArticleCreateOrConnectWithoutArticleInput[]
    upsert?: GuestSavedArticleUpsertWithWhereUniqueWithoutArticleInput | GuestSavedArticleUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: GuestSavedArticleCreateManyArticleInputEnvelope
    set?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    disconnect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    delete?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    update?: GuestSavedArticleUpdateWithWhereUniqueWithoutArticleInput | GuestSavedArticleUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: GuestSavedArticleUpdateManyWithWhereWithoutArticleInput | GuestSavedArticleUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: GuestSavedArticleScalarWhereInput | GuestSavedArticleScalarWhereInput[]
  }

  export type GuestReadingHistoryUpdateManyWithoutArticleNestedInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutArticleInput, GuestReadingHistoryUncheckedCreateWithoutArticleInput> | GuestReadingHistoryCreateWithoutArticleInput[] | GuestReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutArticleInput | GuestReadingHistoryCreateOrConnectWithoutArticleInput[]
    upsert?: GuestReadingHistoryUpsertWithWhereUniqueWithoutArticleInput | GuestReadingHistoryUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: GuestReadingHistoryCreateManyArticleInputEnvelope
    set?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    disconnect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    delete?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    update?: GuestReadingHistoryUpdateWithWhereUniqueWithoutArticleInput | GuestReadingHistoryUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: GuestReadingHistoryUpdateManyWithWhereWithoutArticleInput | GuestReadingHistoryUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: GuestReadingHistoryScalarWhereInput | GuestReadingHistoryScalarWhereInput[]
  }

  export type SavedArticleUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<SavedArticleCreateWithoutArticleInput, SavedArticleUncheckedCreateWithoutArticleInput> | SavedArticleCreateWithoutArticleInput[] | SavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: SavedArticleCreateOrConnectWithoutArticleInput | SavedArticleCreateOrConnectWithoutArticleInput[]
    upsert?: SavedArticleUpsertWithWhereUniqueWithoutArticleInput | SavedArticleUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: SavedArticleCreateManyArticleInputEnvelope
    set?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    disconnect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    delete?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    connect?: SavedArticleWhereUniqueInput | SavedArticleWhereUniqueInput[]
    update?: SavedArticleUpdateWithWhereUniqueWithoutArticleInput | SavedArticleUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: SavedArticleUpdateManyWithWhereWithoutArticleInput | SavedArticleUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: SavedArticleScalarWhereInput | SavedArticleScalarWhereInput[]
  }

  export type ReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<ReadingHistoryCreateWithoutArticleInput, ReadingHistoryUncheckedCreateWithoutArticleInput> | ReadingHistoryCreateWithoutArticleInput[] | ReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: ReadingHistoryCreateOrConnectWithoutArticleInput | ReadingHistoryCreateOrConnectWithoutArticleInput[]
    upsert?: ReadingHistoryUpsertWithWhereUniqueWithoutArticleInput | ReadingHistoryUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: ReadingHistoryCreateManyArticleInputEnvelope
    set?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    disconnect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    delete?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    connect?: ReadingHistoryWhereUniqueInput | ReadingHistoryWhereUniqueInput[]
    update?: ReadingHistoryUpdateWithWhereUniqueWithoutArticleInput | ReadingHistoryUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: ReadingHistoryUpdateManyWithWhereWithoutArticleInput | ReadingHistoryUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: ReadingHistoryScalarWhereInput | ReadingHistoryScalarWhereInput[]
  }

  export type GuestSavedArticleUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<GuestSavedArticleCreateWithoutArticleInput, GuestSavedArticleUncheckedCreateWithoutArticleInput> | GuestSavedArticleCreateWithoutArticleInput[] | GuestSavedArticleUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestSavedArticleCreateOrConnectWithoutArticleInput | GuestSavedArticleCreateOrConnectWithoutArticleInput[]
    upsert?: GuestSavedArticleUpsertWithWhereUniqueWithoutArticleInput | GuestSavedArticleUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: GuestSavedArticleCreateManyArticleInputEnvelope
    set?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    disconnect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    delete?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    connect?: GuestSavedArticleWhereUniqueInput | GuestSavedArticleWhereUniqueInput[]
    update?: GuestSavedArticleUpdateWithWhereUniqueWithoutArticleInput | GuestSavedArticleUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: GuestSavedArticleUpdateManyWithWhereWithoutArticleInput | GuestSavedArticleUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: GuestSavedArticleScalarWhereInput | GuestSavedArticleScalarWhereInput[]
  }

  export type GuestReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput = {
    create?: XOR<GuestReadingHistoryCreateWithoutArticleInput, GuestReadingHistoryUncheckedCreateWithoutArticleInput> | GuestReadingHistoryCreateWithoutArticleInput[] | GuestReadingHistoryUncheckedCreateWithoutArticleInput[]
    connectOrCreate?: GuestReadingHistoryCreateOrConnectWithoutArticleInput | GuestReadingHistoryCreateOrConnectWithoutArticleInput[]
    upsert?: GuestReadingHistoryUpsertWithWhereUniqueWithoutArticleInput | GuestReadingHistoryUpsertWithWhereUniqueWithoutArticleInput[]
    createMany?: GuestReadingHistoryCreateManyArticleInputEnvelope
    set?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    disconnect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    delete?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    connect?: GuestReadingHistoryWhereUniqueInput | GuestReadingHistoryWhereUniqueInput[]
    update?: GuestReadingHistoryUpdateWithWhereUniqueWithoutArticleInput | GuestReadingHistoryUpdateWithWhereUniqueWithoutArticleInput[]
    updateMany?: GuestReadingHistoryUpdateManyWithWhereWithoutArticleInput | GuestReadingHistoryUpdateManyWithWhereWithoutArticleInput[]
    deleteMany?: GuestReadingHistoryScalarWhereInput | GuestReadingHistoryScalarWhereInput[]
  }

  export type StoryClusterCreateentityKeysInput = {
    set: string[]
  }

  export type StoryClusterCreatetitleTokensInput = {
    set: string[]
  }

  export type StoryClusterCreatelanguagesInput = {
    set: string[]
  }

  export type ArticleCreateNestedManyWithoutClusterInput = {
    create?: XOR<ArticleCreateWithoutClusterInput, ArticleUncheckedCreateWithoutClusterInput> | ArticleCreateWithoutClusterInput[] | ArticleUncheckedCreateWithoutClusterInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutClusterInput | ArticleCreateOrConnectWithoutClusterInput[]
    createMany?: ArticleCreateManyClusterInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type ArticleUncheckedCreateNestedManyWithoutClusterInput = {
    create?: XOR<ArticleCreateWithoutClusterInput, ArticleUncheckedCreateWithoutClusterInput> | ArticleCreateWithoutClusterInput[] | ArticleUncheckedCreateWithoutClusterInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutClusterInput | ArticleCreateOrConnectWithoutClusterInput[]
    createMany?: ArticleCreateManyClusterInputEnvelope
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
  }

  export type StoryClusterUpdateentityKeysInput = {
    set?: string[]
    push?: string | string[]
  }

  export type StoryClusterUpdatetitleTokensInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StoryClusterUpdatelanguagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ArticleUpdateManyWithoutClusterNestedInput = {
    create?: XOR<ArticleCreateWithoutClusterInput, ArticleUncheckedCreateWithoutClusterInput> | ArticleCreateWithoutClusterInput[] | ArticleUncheckedCreateWithoutClusterInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutClusterInput | ArticleCreateOrConnectWithoutClusterInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutClusterInput | ArticleUpsertWithWhereUniqueWithoutClusterInput[]
    createMany?: ArticleCreateManyClusterInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutClusterInput | ArticleUpdateWithWhereUniqueWithoutClusterInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutClusterInput | ArticleUpdateManyWithWhereWithoutClusterInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type ArticleUncheckedUpdateManyWithoutClusterNestedInput = {
    create?: XOR<ArticleCreateWithoutClusterInput, ArticleUncheckedCreateWithoutClusterInput> | ArticleCreateWithoutClusterInput[] | ArticleUncheckedCreateWithoutClusterInput[]
    connectOrCreate?: ArticleCreateOrConnectWithoutClusterInput | ArticleCreateOrConnectWithoutClusterInput[]
    upsert?: ArticleUpsertWithWhereUniqueWithoutClusterInput | ArticleUpsertWithWhereUniqueWithoutClusterInput[]
    createMany?: ArticleCreateManyClusterInputEnvelope
    set?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    disconnect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    delete?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    connect?: ArticleWhereUniqueInput | ArticleWhereUniqueInput[]
    update?: ArticleUpdateWithWhereUniqueWithoutClusterInput | ArticleUpdateWithWhereUniqueWithoutClusterInput[]
    updateMany?: ArticleUpdateManyWithWhereWithoutClusterInput | ArticleUpdateManyWithWhereWithoutClusterInput[]
    deleteMany?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumAppLocaleFilter<$PrismaModel = never> = {
    equals?: $Enums.AppLocale | EnumAppLocaleFieldRefInput<$PrismaModel>
    in?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    not?: NestedEnumAppLocaleFilter<$PrismaModel> | $Enums.AppLocale
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAppLocaleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppLocale | EnumAppLocaleFieldRefInput<$PrismaModel>
    in?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppLocale[] | ListEnumAppLocaleFieldRefInput<$PrismaModel>
    not?: NestedEnumAppLocaleWithAggregatesFilter<$PrismaModel> | $Enums.AppLocale
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppLocaleFilter<$PrismaModel>
    _max?: NestedEnumAppLocaleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider
  }

  export type NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthProviderFilter<$PrismaModel>
    _max?: NestedEnumAuthProviderFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type SavedArticleCreateWithoutUserInput = {
    id?: string
    savedAt?: Date | string
    article: ArticleCreateNestedOneWithoutSavedByInput
  }

  export type SavedArticleUncheckedCreateWithoutUserInput = {
    id?: string
    articleId: string
    savedAt?: Date | string
  }

  export type SavedArticleCreateOrConnectWithoutUserInput = {
    where: SavedArticleWhereUniqueInput
    create: XOR<SavedArticleCreateWithoutUserInput, SavedArticleUncheckedCreateWithoutUserInput>
  }

  export type SavedArticleCreateManyUserInputEnvelope = {
    data: SavedArticleCreateManyUserInput | SavedArticleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReadingHistoryCreateWithoutUserInput = {
    id?: string
    readAt?: Date | string
    article: ArticleCreateNestedOneWithoutReadingHistoryInput
  }

  export type ReadingHistoryUncheckedCreateWithoutUserInput = {
    id?: string
    articleId: string
    readAt?: Date | string
  }

  export type ReadingHistoryCreateOrConnectWithoutUserInput = {
    where: ReadingHistoryWhereUniqueInput
    create: XOR<ReadingHistoryCreateWithoutUserInput, ReadingHistoryUncheckedCreateWithoutUserInput>
  }

  export type ReadingHistoryCreateManyUserInputEnvelope = {
    data: ReadingHistoryCreateManyUserInput | ReadingHistoryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OAuthAccountCreateWithoutUserInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthAccountUncheckedCreateWithoutUserInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthAccountCreateOrConnectWithoutUserInput = {
    where: OAuthAccountWhereUniqueInput
    create: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
  }

  export type OAuthAccountCreateManyUserInputEnvelope = {
    data: OAuthAccountCreateManyUserInput | OAuthAccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SavedArticleUpsertWithWhereUniqueWithoutUserInput = {
    where: SavedArticleWhereUniqueInput
    update: XOR<SavedArticleUpdateWithoutUserInput, SavedArticleUncheckedUpdateWithoutUserInput>
    create: XOR<SavedArticleCreateWithoutUserInput, SavedArticleUncheckedCreateWithoutUserInput>
  }

  export type SavedArticleUpdateWithWhereUniqueWithoutUserInput = {
    where: SavedArticleWhereUniqueInput
    data: XOR<SavedArticleUpdateWithoutUserInput, SavedArticleUncheckedUpdateWithoutUserInput>
  }

  export type SavedArticleUpdateManyWithWhereWithoutUserInput = {
    where: SavedArticleScalarWhereInput
    data: XOR<SavedArticleUpdateManyMutationInput, SavedArticleUncheckedUpdateManyWithoutUserInput>
  }

  export type SavedArticleScalarWhereInput = {
    AND?: SavedArticleScalarWhereInput | SavedArticleScalarWhereInput[]
    OR?: SavedArticleScalarWhereInput[]
    NOT?: SavedArticleScalarWhereInput | SavedArticleScalarWhereInput[]
    id?: StringFilter<"SavedArticle"> | string
    userId?: StringFilter<"SavedArticle"> | string
    articleId?: StringFilter<"SavedArticle"> | string
    savedAt?: DateTimeFilter<"SavedArticle"> | Date | string
  }

  export type ReadingHistoryUpsertWithWhereUniqueWithoutUserInput = {
    where: ReadingHistoryWhereUniqueInput
    update: XOR<ReadingHistoryUpdateWithoutUserInput, ReadingHistoryUncheckedUpdateWithoutUserInput>
    create: XOR<ReadingHistoryCreateWithoutUserInput, ReadingHistoryUncheckedCreateWithoutUserInput>
  }

  export type ReadingHistoryUpdateWithWhereUniqueWithoutUserInput = {
    where: ReadingHistoryWhereUniqueInput
    data: XOR<ReadingHistoryUpdateWithoutUserInput, ReadingHistoryUncheckedUpdateWithoutUserInput>
  }

  export type ReadingHistoryUpdateManyWithWhereWithoutUserInput = {
    where: ReadingHistoryScalarWhereInput
    data: XOR<ReadingHistoryUpdateManyMutationInput, ReadingHistoryUncheckedUpdateManyWithoutUserInput>
  }

  export type ReadingHistoryScalarWhereInput = {
    AND?: ReadingHistoryScalarWhereInput | ReadingHistoryScalarWhereInput[]
    OR?: ReadingHistoryScalarWhereInput[]
    NOT?: ReadingHistoryScalarWhereInput | ReadingHistoryScalarWhereInput[]
    id?: StringFilter<"ReadingHistory"> | string
    userId?: StringFilter<"ReadingHistory"> | string
    articleId?: StringFilter<"ReadingHistory"> | string
    readAt?: DateTimeFilter<"ReadingHistory"> | Date | string
  }

  export type OAuthAccountUpsertWithWhereUniqueWithoutUserInput = {
    where: OAuthAccountWhereUniqueInput
    update: XOR<OAuthAccountUpdateWithoutUserInput, OAuthAccountUncheckedUpdateWithoutUserInput>
    create: XOR<OAuthAccountCreateWithoutUserInput, OAuthAccountUncheckedCreateWithoutUserInput>
  }

  export type OAuthAccountUpdateWithWhereUniqueWithoutUserInput = {
    where: OAuthAccountWhereUniqueInput
    data: XOR<OAuthAccountUpdateWithoutUserInput, OAuthAccountUncheckedUpdateWithoutUserInput>
  }

  export type OAuthAccountUpdateManyWithWhereWithoutUserInput = {
    where: OAuthAccountScalarWhereInput
    data: XOR<OAuthAccountUpdateManyMutationInput, OAuthAccountUncheckedUpdateManyWithoutUserInput>
  }

  export type OAuthAccountScalarWhereInput = {
    AND?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
    OR?: OAuthAccountScalarWhereInput[]
    NOT?: OAuthAccountScalarWhereInput | OAuthAccountScalarWhereInput[]
    id?: StringFilter<"OAuthAccount"> | string
    userId?: StringFilter<"OAuthAccount"> | string
    provider?: EnumAuthProviderFilter<"OAuthAccount"> | $Enums.AuthProvider
    providerAccountId?: StringFilter<"OAuthAccount"> | string
    createdAt?: DateTimeFilter<"OAuthAccount"> | Date | string
    updatedAt?: DateTimeFilter<"OAuthAccount"> | Date | string
  }

  export type UserCreateWithoutOauthAccountsInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    savedArticles?: SavedArticleCreateNestedManyWithoutUserInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOauthAccountsInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    savedArticles?: SavedArticleUncheckedCreateNestedManyWithoutUserInput
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOauthAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
  }

  export type UserUpsertWithoutOauthAccountsInput = {
    update: XOR<UserUpdateWithoutOauthAccountsInput, UserUncheckedUpdateWithoutOauthAccountsInput>
    create: XOR<UserCreateWithoutOauthAccountsInput, UserUncheckedCreateWithoutOauthAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOauthAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOauthAccountsInput, UserUncheckedUpdateWithoutOauthAccountsInput>
  }

  export type UserUpdateWithoutOauthAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedArticles?: SavedArticleUpdateManyWithoutUserNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOauthAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedArticles?: SavedArticleUncheckedUpdateManyWithoutUserNestedInput
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GuestSavedArticleCreateWithoutSessionInput = {
    id?: string
    savedAt?: Date | string
    article: ArticleCreateNestedOneWithoutGuestSavesInput
  }

  export type GuestSavedArticleUncheckedCreateWithoutSessionInput = {
    id?: string
    articleId: string
    savedAt?: Date | string
  }

  export type GuestSavedArticleCreateOrConnectWithoutSessionInput = {
    where: GuestSavedArticleWhereUniqueInput
    create: XOR<GuestSavedArticleCreateWithoutSessionInput, GuestSavedArticleUncheckedCreateWithoutSessionInput>
  }

  export type GuestSavedArticleCreateManySessionInputEnvelope = {
    data: GuestSavedArticleCreateManySessionInput | GuestSavedArticleCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type GuestReadingHistoryCreateWithoutSessionInput = {
    id?: string
    readAt?: Date | string
    article: ArticleCreateNestedOneWithoutGuestReadingHistoryInput
  }

  export type GuestReadingHistoryUncheckedCreateWithoutSessionInput = {
    id?: string
    articleId: string
    readAt?: Date | string
  }

  export type GuestReadingHistoryCreateOrConnectWithoutSessionInput = {
    where: GuestReadingHistoryWhereUniqueInput
    create: XOR<GuestReadingHistoryCreateWithoutSessionInput, GuestReadingHistoryUncheckedCreateWithoutSessionInput>
  }

  export type GuestReadingHistoryCreateManySessionInputEnvelope = {
    data: GuestReadingHistoryCreateManySessionInput | GuestReadingHistoryCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type GuestSavedArticleUpsertWithWhereUniqueWithoutSessionInput = {
    where: GuestSavedArticleWhereUniqueInput
    update: XOR<GuestSavedArticleUpdateWithoutSessionInput, GuestSavedArticleUncheckedUpdateWithoutSessionInput>
    create: XOR<GuestSavedArticleCreateWithoutSessionInput, GuestSavedArticleUncheckedCreateWithoutSessionInput>
  }

  export type GuestSavedArticleUpdateWithWhereUniqueWithoutSessionInput = {
    where: GuestSavedArticleWhereUniqueInput
    data: XOR<GuestSavedArticleUpdateWithoutSessionInput, GuestSavedArticleUncheckedUpdateWithoutSessionInput>
  }

  export type GuestSavedArticleUpdateManyWithWhereWithoutSessionInput = {
    where: GuestSavedArticleScalarWhereInput
    data: XOR<GuestSavedArticleUpdateManyMutationInput, GuestSavedArticleUncheckedUpdateManyWithoutSessionInput>
  }

  export type GuestSavedArticleScalarWhereInput = {
    AND?: GuestSavedArticleScalarWhereInput | GuestSavedArticleScalarWhereInput[]
    OR?: GuestSavedArticleScalarWhereInput[]
    NOT?: GuestSavedArticleScalarWhereInput | GuestSavedArticleScalarWhereInput[]
    id?: StringFilter<"GuestSavedArticle"> | string
    guestSessionId?: StringFilter<"GuestSavedArticle"> | string
    articleId?: StringFilter<"GuestSavedArticle"> | string
    savedAt?: DateTimeFilter<"GuestSavedArticle"> | Date | string
  }

  export type GuestReadingHistoryUpsertWithWhereUniqueWithoutSessionInput = {
    where: GuestReadingHistoryWhereUniqueInput
    update: XOR<GuestReadingHistoryUpdateWithoutSessionInput, GuestReadingHistoryUncheckedUpdateWithoutSessionInput>
    create: XOR<GuestReadingHistoryCreateWithoutSessionInput, GuestReadingHistoryUncheckedCreateWithoutSessionInput>
  }

  export type GuestReadingHistoryUpdateWithWhereUniqueWithoutSessionInput = {
    where: GuestReadingHistoryWhereUniqueInput
    data: XOR<GuestReadingHistoryUpdateWithoutSessionInput, GuestReadingHistoryUncheckedUpdateWithoutSessionInput>
  }

  export type GuestReadingHistoryUpdateManyWithWhereWithoutSessionInput = {
    where: GuestReadingHistoryScalarWhereInput
    data: XOR<GuestReadingHistoryUpdateManyMutationInput, GuestReadingHistoryUncheckedUpdateManyWithoutSessionInput>
  }

  export type GuestReadingHistoryScalarWhereInput = {
    AND?: GuestReadingHistoryScalarWhereInput | GuestReadingHistoryScalarWhereInput[]
    OR?: GuestReadingHistoryScalarWhereInput[]
    NOT?: GuestReadingHistoryScalarWhereInput | GuestReadingHistoryScalarWhereInput[]
    id?: StringFilter<"GuestReadingHistory"> | string
    guestSessionId?: StringFilter<"GuestReadingHistory"> | string
    articleId?: StringFilter<"GuestReadingHistory"> | string
    readAt?: DateTimeFilter<"GuestReadingHistory"> | Date | string
  }

  export type GuestSessionCreateWithoutSavedArticlesInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    readingHistory?: GuestReadingHistoryCreateNestedManyWithoutSessionInput
  }

  export type GuestSessionUncheckedCreateWithoutSavedArticlesInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    readingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutSessionInput
  }

  export type GuestSessionCreateOrConnectWithoutSavedArticlesInput = {
    where: GuestSessionWhereUniqueInput
    create: XOR<GuestSessionCreateWithoutSavedArticlesInput, GuestSessionUncheckedCreateWithoutSavedArticlesInput>
  }

  export type ArticleCreateWithoutGuestSavesInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    cluster?: StoryClusterCreateNestedOneWithoutArticlesInput
    savedBy?: SavedArticleCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutGuestSavesInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clusterId?: string | null
    savedBy?: SavedArticleUncheckedCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutGuestSavesInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutGuestSavesInput, ArticleUncheckedCreateWithoutGuestSavesInput>
  }

  export type GuestSessionUpsertWithoutSavedArticlesInput = {
    update: XOR<GuestSessionUpdateWithoutSavedArticlesInput, GuestSessionUncheckedUpdateWithoutSavedArticlesInput>
    create: XOR<GuestSessionCreateWithoutSavedArticlesInput, GuestSessionUncheckedCreateWithoutSavedArticlesInput>
    where?: GuestSessionWhereInput
  }

  export type GuestSessionUpdateToOneWithWhereWithoutSavedArticlesInput = {
    where?: GuestSessionWhereInput
    data: XOR<GuestSessionUpdateWithoutSavedArticlesInput, GuestSessionUncheckedUpdateWithoutSavedArticlesInput>
  }

  export type GuestSessionUpdateWithoutSavedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readingHistory?: GuestReadingHistoryUpdateManyWithoutSessionNestedInput
  }

  export type GuestSessionUncheckedUpdateWithoutSavedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ArticleUpsertWithoutGuestSavesInput = {
    update: XOR<ArticleUpdateWithoutGuestSavesInput, ArticleUncheckedUpdateWithoutGuestSavesInput>
    create: XOR<ArticleCreateWithoutGuestSavesInput, ArticleUncheckedCreateWithoutGuestSavesInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutGuestSavesInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutGuestSavesInput, ArticleUncheckedUpdateWithoutGuestSavesInput>
  }

  export type ArticleUpdateWithoutGuestSavesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cluster?: StoryClusterUpdateOneWithoutArticlesNestedInput
    savedBy?: SavedArticleUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutGuestSavesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterId?: NullableStringFieldUpdateOperationsInput | string | null
    savedBy?: SavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type GuestSessionCreateWithoutReadingHistoryInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    savedArticles?: GuestSavedArticleCreateNestedManyWithoutSessionInput
  }

  export type GuestSessionUncheckedCreateWithoutReadingHistoryInput = {
    id?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    savedArticles?: GuestSavedArticleUncheckedCreateNestedManyWithoutSessionInput
  }

  export type GuestSessionCreateOrConnectWithoutReadingHistoryInput = {
    where: GuestSessionWhereUniqueInput
    create: XOR<GuestSessionCreateWithoutReadingHistoryInput, GuestSessionUncheckedCreateWithoutReadingHistoryInput>
  }

  export type ArticleCreateWithoutGuestReadingHistoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    cluster?: StoryClusterCreateNestedOneWithoutArticlesInput
    savedBy?: SavedArticleCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutGuestReadingHistoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clusterId?: string | null
    savedBy?: SavedArticleUncheckedCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutGuestReadingHistoryInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutGuestReadingHistoryInput, ArticleUncheckedCreateWithoutGuestReadingHistoryInput>
  }

  export type GuestSessionUpsertWithoutReadingHistoryInput = {
    update: XOR<GuestSessionUpdateWithoutReadingHistoryInput, GuestSessionUncheckedUpdateWithoutReadingHistoryInput>
    create: XOR<GuestSessionCreateWithoutReadingHistoryInput, GuestSessionUncheckedCreateWithoutReadingHistoryInput>
    where?: GuestSessionWhereInput
  }

  export type GuestSessionUpdateToOneWithWhereWithoutReadingHistoryInput = {
    where?: GuestSessionWhereInput
    data: XOR<GuestSessionUpdateWithoutReadingHistoryInput, GuestSessionUncheckedUpdateWithoutReadingHistoryInput>
  }

  export type GuestSessionUpdateWithoutReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    savedArticles?: GuestSavedArticleUpdateManyWithoutSessionNestedInput
  }

  export type GuestSessionUncheckedUpdateWithoutReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    savedArticles?: GuestSavedArticleUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ArticleUpsertWithoutGuestReadingHistoryInput = {
    update: XOR<ArticleUpdateWithoutGuestReadingHistoryInput, ArticleUncheckedUpdateWithoutGuestReadingHistoryInput>
    create: XOR<ArticleCreateWithoutGuestReadingHistoryInput, ArticleUncheckedCreateWithoutGuestReadingHistoryInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutGuestReadingHistoryInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutGuestReadingHistoryInput, ArticleUncheckedUpdateWithoutGuestReadingHistoryInput>
  }

  export type ArticleUpdateWithoutGuestReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cluster?: StoryClusterUpdateOneWithoutArticlesNestedInput
    savedBy?: SavedArticleUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutGuestReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterId?: NullableStringFieldUpdateOperationsInput | string | null
    savedBy?: SavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type UserCreateWithoutSavedArticlesInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    readingHistory?: ReadingHistoryCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSavedArticlesInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSavedArticlesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSavedArticlesInput, UserUncheckedCreateWithoutSavedArticlesInput>
  }

  export type ArticleCreateWithoutSavedByInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    cluster?: StoryClusterCreateNestedOneWithoutArticlesInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutSavedByInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clusterId?: string | null
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleUncheckedCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutSavedByInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutSavedByInput, ArticleUncheckedCreateWithoutSavedByInput>
  }

  export type UserUpsertWithoutSavedArticlesInput = {
    update: XOR<UserUpdateWithoutSavedArticlesInput, UserUncheckedUpdateWithoutSavedArticlesInput>
    create: XOR<UserCreateWithoutSavedArticlesInput, UserUncheckedCreateWithoutSavedArticlesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSavedArticlesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSavedArticlesInput, UserUncheckedUpdateWithoutSavedArticlesInput>
  }

  export type UserUpdateWithoutSavedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingHistory?: ReadingHistoryUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSavedArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ArticleUpsertWithoutSavedByInput = {
    update: XOR<ArticleUpdateWithoutSavedByInput, ArticleUncheckedUpdateWithoutSavedByInput>
    create: XOR<ArticleCreateWithoutSavedByInput, ArticleUncheckedCreateWithoutSavedByInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutSavedByInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutSavedByInput, ArticleUncheckedUpdateWithoutSavedByInput>
  }

  export type ArticleUpdateWithoutSavedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cluster?: StoryClusterUpdateOneWithoutArticlesNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutSavedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterId?: NullableStringFieldUpdateOperationsInput | string | null
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type UserCreateWithoutReadingHistoryInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    savedArticles?: SavedArticleCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReadingHistoryInput = {
    id?: string
    email?: string | null
    name?: string | null
    avatarUrl?: string | null
    preferredLanguage?: $Enums.AppLocale
    favoriteTopics?: UserCreatefavoriteTopicsInput | string[]
    dailyDigest?: boolean
    breakingNews?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    savedArticles?: SavedArticleUncheckedCreateNestedManyWithoutUserInput
    oauthAccounts?: OAuthAccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReadingHistoryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReadingHistoryInput, UserUncheckedCreateWithoutReadingHistoryInput>
  }

  export type ArticleCreateWithoutReadingHistoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    cluster?: StoryClusterCreateNestedOneWithoutArticlesInput
    savedBy?: SavedArticleCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutReadingHistoryInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    clusterId?: string | null
    savedBy?: SavedArticleUncheckedCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleUncheckedCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutReadingHistoryInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutReadingHistoryInput, ArticleUncheckedCreateWithoutReadingHistoryInput>
  }

  export type UserUpsertWithoutReadingHistoryInput = {
    update: XOR<UserUpdateWithoutReadingHistoryInput, UserUncheckedUpdateWithoutReadingHistoryInput>
    create: XOR<UserCreateWithoutReadingHistoryInput, UserUncheckedCreateWithoutReadingHistoryInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReadingHistoryInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReadingHistoryInput, UserUncheckedUpdateWithoutReadingHistoryInput>
  }

  export type UserUpdateWithoutReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedArticles?: SavedArticleUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: EnumAppLocaleFieldUpdateOperationsInput | $Enums.AppLocale
    favoriteTopics?: UserUpdatefavoriteTopicsInput | string[]
    dailyDigest?: BoolFieldUpdateOperationsInput | boolean
    breakingNews?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedArticles?: SavedArticleUncheckedUpdateManyWithoutUserNestedInput
    oauthAccounts?: OAuthAccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ArticleUpsertWithoutReadingHistoryInput = {
    update: XOR<ArticleUpdateWithoutReadingHistoryInput, ArticleUncheckedUpdateWithoutReadingHistoryInput>
    create: XOR<ArticleCreateWithoutReadingHistoryInput, ArticleUncheckedCreateWithoutReadingHistoryInput>
    where?: ArticleWhereInput
  }

  export type ArticleUpdateToOneWithWhereWithoutReadingHistoryInput = {
    where?: ArticleWhereInput
    data: XOR<ArticleUpdateWithoutReadingHistoryInput, ArticleUncheckedUpdateWithoutReadingHistoryInput>
  }

  export type ArticleUpdateWithoutReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cluster?: StoryClusterUpdateOneWithoutArticlesNestedInput
    savedBy?: SavedArticleUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutReadingHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clusterId?: NullableStringFieldUpdateOperationsInput | string | null
    savedBy?: SavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type StoryClusterCreateWithoutArticlesInput = {
    id?: string
    canonicalTitle: string
    canonicalSummary?: string | null
    imageUrl?: string | null
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    language?: string
    entityKeys?: StoryClusterCreateentityKeysInput | string[]
    titleTokens?: StoryClusterCreatetitleTokensInput | string[]
    sourceCount?: number
    articleCount?: number
    languages?: StoryClusterCreatelanguagesInput | string[]
    leadArticleId?: string | null
    latestPublishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoryClusterUncheckedCreateWithoutArticlesInput = {
    id?: string
    canonicalTitle: string
    canonicalSummary?: string | null
    imageUrl?: string | null
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    language?: string
    entityKeys?: StoryClusterCreateentityKeysInput | string[]
    titleTokens?: StoryClusterCreatetitleTokensInput | string[]
    sourceCount?: number
    articleCount?: number
    languages?: StoryClusterCreatelanguagesInput | string[]
    leadArticleId?: string | null
    latestPublishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoryClusterCreateOrConnectWithoutArticlesInput = {
    where: StoryClusterWhereUniqueInput
    create: XOR<StoryClusterCreateWithoutArticlesInput, StoryClusterUncheckedCreateWithoutArticlesInput>
  }

  export type SavedArticleCreateWithoutArticleInput = {
    id?: string
    savedAt?: Date | string
    user: UserCreateNestedOneWithoutSavedArticlesInput
  }

  export type SavedArticleUncheckedCreateWithoutArticleInput = {
    id?: string
    userId: string
    savedAt?: Date | string
  }

  export type SavedArticleCreateOrConnectWithoutArticleInput = {
    where: SavedArticleWhereUniqueInput
    create: XOR<SavedArticleCreateWithoutArticleInput, SavedArticleUncheckedCreateWithoutArticleInput>
  }

  export type SavedArticleCreateManyArticleInputEnvelope = {
    data: SavedArticleCreateManyArticleInput | SavedArticleCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type ReadingHistoryCreateWithoutArticleInput = {
    id?: string
    readAt?: Date | string
    user: UserCreateNestedOneWithoutReadingHistoryInput
  }

  export type ReadingHistoryUncheckedCreateWithoutArticleInput = {
    id?: string
    userId: string
    readAt?: Date | string
  }

  export type ReadingHistoryCreateOrConnectWithoutArticleInput = {
    where: ReadingHistoryWhereUniqueInput
    create: XOR<ReadingHistoryCreateWithoutArticleInput, ReadingHistoryUncheckedCreateWithoutArticleInput>
  }

  export type ReadingHistoryCreateManyArticleInputEnvelope = {
    data: ReadingHistoryCreateManyArticleInput | ReadingHistoryCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type GuestSavedArticleCreateWithoutArticleInput = {
    id?: string
    savedAt?: Date | string
    session: GuestSessionCreateNestedOneWithoutSavedArticlesInput
  }

  export type GuestSavedArticleUncheckedCreateWithoutArticleInput = {
    id?: string
    guestSessionId: string
    savedAt?: Date | string
  }

  export type GuestSavedArticleCreateOrConnectWithoutArticleInput = {
    where: GuestSavedArticleWhereUniqueInput
    create: XOR<GuestSavedArticleCreateWithoutArticleInput, GuestSavedArticleUncheckedCreateWithoutArticleInput>
  }

  export type GuestSavedArticleCreateManyArticleInputEnvelope = {
    data: GuestSavedArticleCreateManyArticleInput | GuestSavedArticleCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type GuestReadingHistoryCreateWithoutArticleInput = {
    id?: string
    readAt?: Date | string
    session: GuestSessionCreateNestedOneWithoutReadingHistoryInput
  }

  export type GuestReadingHistoryUncheckedCreateWithoutArticleInput = {
    id?: string
    guestSessionId: string
    readAt?: Date | string
  }

  export type GuestReadingHistoryCreateOrConnectWithoutArticleInput = {
    where: GuestReadingHistoryWhereUniqueInput
    create: XOR<GuestReadingHistoryCreateWithoutArticleInput, GuestReadingHistoryUncheckedCreateWithoutArticleInput>
  }

  export type GuestReadingHistoryCreateManyArticleInputEnvelope = {
    data: GuestReadingHistoryCreateManyArticleInput | GuestReadingHistoryCreateManyArticleInput[]
    skipDuplicates?: boolean
  }

  export type StoryClusterUpsertWithoutArticlesInput = {
    update: XOR<StoryClusterUpdateWithoutArticlesInput, StoryClusterUncheckedUpdateWithoutArticlesInput>
    create: XOR<StoryClusterCreateWithoutArticlesInput, StoryClusterUncheckedCreateWithoutArticlesInput>
    where?: StoryClusterWhereInput
  }

  export type StoryClusterUpdateToOneWithWhereWithoutArticlesInput = {
    where?: StoryClusterWhereInput
    data: XOR<StoryClusterUpdateWithoutArticlesInput, StoryClusterUncheckedUpdateWithoutArticlesInput>
  }

  export type StoryClusterUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    canonicalTitle?: StringFieldUpdateOperationsInput | string
    canonicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    entityKeys?: StoryClusterUpdateentityKeysInput | string[]
    titleTokens?: StoryClusterUpdatetitleTokensInput | string[]
    sourceCount?: IntFieldUpdateOperationsInput | number
    articleCount?: IntFieldUpdateOperationsInput | number
    languages?: StoryClusterUpdatelanguagesInput | string[]
    leadArticleId?: NullableStringFieldUpdateOperationsInput | string | null
    latestPublishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoryClusterUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    canonicalTitle?: StringFieldUpdateOperationsInput | string
    canonicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    entityKeys?: StoryClusterUpdateentityKeysInput | string[]
    titleTokens?: StoryClusterUpdatetitleTokensInput | string[]
    sourceCount?: IntFieldUpdateOperationsInput | number
    articleCount?: IntFieldUpdateOperationsInput | number
    languages?: StoryClusterUpdatelanguagesInput | string[]
    leadArticleId?: NullableStringFieldUpdateOperationsInput | string | null
    latestPublishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleUpsertWithWhereUniqueWithoutArticleInput = {
    where: SavedArticleWhereUniqueInput
    update: XOR<SavedArticleUpdateWithoutArticleInput, SavedArticleUncheckedUpdateWithoutArticleInput>
    create: XOR<SavedArticleCreateWithoutArticleInput, SavedArticleUncheckedCreateWithoutArticleInput>
  }

  export type SavedArticleUpdateWithWhereUniqueWithoutArticleInput = {
    where: SavedArticleWhereUniqueInput
    data: XOR<SavedArticleUpdateWithoutArticleInput, SavedArticleUncheckedUpdateWithoutArticleInput>
  }

  export type SavedArticleUpdateManyWithWhereWithoutArticleInput = {
    where: SavedArticleScalarWhereInput
    data: XOR<SavedArticleUpdateManyMutationInput, SavedArticleUncheckedUpdateManyWithoutArticleInput>
  }

  export type ReadingHistoryUpsertWithWhereUniqueWithoutArticleInput = {
    where: ReadingHistoryWhereUniqueInput
    update: XOR<ReadingHistoryUpdateWithoutArticleInput, ReadingHistoryUncheckedUpdateWithoutArticleInput>
    create: XOR<ReadingHistoryCreateWithoutArticleInput, ReadingHistoryUncheckedCreateWithoutArticleInput>
  }

  export type ReadingHistoryUpdateWithWhereUniqueWithoutArticleInput = {
    where: ReadingHistoryWhereUniqueInput
    data: XOR<ReadingHistoryUpdateWithoutArticleInput, ReadingHistoryUncheckedUpdateWithoutArticleInput>
  }

  export type ReadingHistoryUpdateManyWithWhereWithoutArticleInput = {
    where: ReadingHistoryScalarWhereInput
    data: XOR<ReadingHistoryUpdateManyMutationInput, ReadingHistoryUncheckedUpdateManyWithoutArticleInput>
  }

  export type GuestSavedArticleUpsertWithWhereUniqueWithoutArticleInput = {
    where: GuestSavedArticleWhereUniqueInput
    update: XOR<GuestSavedArticleUpdateWithoutArticleInput, GuestSavedArticleUncheckedUpdateWithoutArticleInput>
    create: XOR<GuestSavedArticleCreateWithoutArticleInput, GuestSavedArticleUncheckedCreateWithoutArticleInput>
  }

  export type GuestSavedArticleUpdateWithWhereUniqueWithoutArticleInput = {
    where: GuestSavedArticleWhereUniqueInput
    data: XOR<GuestSavedArticleUpdateWithoutArticleInput, GuestSavedArticleUncheckedUpdateWithoutArticleInput>
  }

  export type GuestSavedArticleUpdateManyWithWhereWithoutArticleInput = {
    where: GuestSavedArticleScalarWhereInput
    data: XOR<GuestSavedArticleUpdateManyMutationInput, GuestSavedArticleUncheckedUpdateManyWithoutArticleInput>
  }

  export type GuestReadingHistoryUpsertWithWhereUniqueWithoutArticleInput = {
    where: GuestReadingHistoryWhereUniqueInput
    update: XOR<GuestReadingHistoryUpdateWithoutArticleInput, GuestReadingHistoryUncheckedUpdateWithoutArticleInput>
    create: XOR<GuestReadingHistoryCreateWithoutArticleInput, GuestReadingHistoryUncheckedCreateWithoutArticleInput>
  }

  export type GuestReadingHistoryUpdateWithWhereUniqueWithoutArticleInput = {
    where: GuestReadingHistoryWhereUniqueInput
    data: XOR<GuestReadingHistoryUpdateWithoutArticleInput, GuestReadingHistoryUncheckedUpdateWithoutArticleInput>
  }

  export type GuestReadingHistoryUpdateManyWithWhereWithoutArticleInput = {
    where: GuestReadingHistoryScalarWhereInput
    data: XOR<GuestReadingHistoryUpdateManyMutationInput, GuestReadingHistoryUncheckedUpdateManyWithoutArticleInput>
  }

  export type ArticleCreateWithoutClusterInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    savedBy?: SavedArticleCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryCreateNestedManyWithoutArticleInput
  }

  export type ArticleUncheckedCreateWithoutClusterInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    savedBy?: SavedArticleUncheckedCreateNestedManyWithoutArticleInput
    readingHistory?: ReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
    guestSaves?: GuestSavedArticleUncheckedCreateNestedManyWithoutArticleInput
    guestReadingHistory?: GuestReadingHistoryUncheckedCreateNestedManyWithoutArticleInput
  }

  export type ArticleCreateOrConnectWithoutClusterInput = {
    where: ArticleWhereUniqueInput
    create: XOR<ArticleCreateWithoutClusterInput, ArticleUncheckedCreateWithoutClusterInput>
  }

  export type ArticleCreateManyClusterInputEnvelope = {
    data: ArticleCreateManyClusterInput | ArticleCreateManyClusterInput[]
    skipDuplicates?: boolean
  }

  export type ArticleUpsertWithWhereUniqueWithoutClusterInput = {
    where: ArticleWhereUniqueInput
    update: XOR<ArticleUpdateWithoutClusterInput, ArticleUncheckedUpdateWithoutClusterInput>
    create: XOR<ArticleCreateWithoutClusterInput, ArticleUncheckedCreateWithoutClusterInput>
  }

  export type ArticleUpdateWithWhereUniqueWithoutClusterInput = {
    where: ArticleWhereUniqueInput
    data: XOR<ArticleUpdateWithoutClusterInput, ArticleUncheckedUpdateWithoutClusterInput>
  }

  export type ArticleUpdateManyWithWhereWithoutClusterInput = {
    where: ArticleScalarWhereInput
    data: XOR<ArticleUpdateManyMutationInput, ArticleUncheckedUpdateManyWithoutClusterInput>
  }

  export type ArticleScalarWhereInput = {
    AND?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    OR?: ArticleScalarWhereInput[]
    NOT?: ArticleScalarWhereInput | ArticleScalarWhereInput[]
    id?: StringFilter<"Article"> | string
    title?: StringFilter<"Article"> | string
    content?: StringFilter<"Article"> | string
    summary?: StringNullableFilter<"Article"> | string | null
    summaryFr?: StringNullableFilter<"Article"> | string | null
    summaryRw?: StringNullableFilter<"Article"> | string | null
    imageUrl?: StringNullableFilter<"Article"> | string | null
    originalLanguage?: StringFilter<"Article"> | string
    source?: StringFilter<"Article"> | string
    url?: StringFilter<"Article"> | string
    category?: StringNullableFilter<"Article"> | string | null
    continent?: StringNullableFilter<"Article"> | string | null
    region?: StringNullableFilter<"Article"> | string | null
    country?: StringNullableFilter<"Article"> | string | null
    publishedAt?: DateTimeFilter<"Article"> | Date | string
    createdAt?: DateTimeFilter<"Article"> | Date | string
    updatedAt?: DateTimeFilter<"Article"> | Date | string
    clusterId?: StringNullableFilter<"Article"> | string | null
  }

  export type SavedArticleCreateManyUserInput = {
    id?: string
    articleId: string
    savedAt?: Date | string
  }

  export type ReadingHistoryCreateManyUserInput = {
    id?: string
    articleId: string
    readAt?: Date | string
  }

  export type OAuthAccountCreateManyUserInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerAccountId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedArticleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutSavedByNestedInput
  }

  export type SavedArticleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutReadingHistoryNestedInput
  }

  export type ReadingHistoryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthAccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerAccountId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSavedArticleCreateManySessionInput = {
    id?: string
    articleId: string
    savedAt?: Date | string
  }

  export type GuestReadingHistoryCreateManySessionInput = {
    id?: string
    articleId: string
    readAt?: Date | string
  }

  export type GuestSavedArticleUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutGuestSavesNestedInput
  }

  export type GuestSavedArticleUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSavedArticleUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    article?: ArticleUpdateOneRequiredWithoutGuestReadingHistoryNestedInput
  }

  export type GuestReadingHistoryUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    articleId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleCreateManyArticleInput = {
    id?: string
    userId: string
    savedAt?: Date | string
  }

  export type ReadingHistoryCreateManyArticleInput = {
    id?: string
    userId: string
    readAt?: Date | string
  }

  export type GuestSavedArticleCreateManyArticleInput = {
    id?: string
    guestSessionId: string
    savedAt?: Date | string
  }

  export type GuestReadingHistoryCreateManyArticleInput = {
    id?: string
    guestSessionId: string
    readAt?: Date | string
  }

  export type SavedArticleUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSavedArticlesNestedInput
  }

  export type SavedArticleUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedArticleUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReadingHistoryNestedInput
  }

  export type ReadingHistoryUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingHistoryUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSavedArticleUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: GuestSessionUpdateOneRequiredWithoutSavedArticlesNestedInput
  }

  export type GuestSavedArticleUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestSavedArticleUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    savedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: GuestSessionUpdateOneRequiredWithoutReadingHistoryNestedInput
  }

  export type GuestReadingHistoryUncheckedUpdateWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuestReadingHistoryUncheckedUpdateManyWithoutArticleInput = {
    id?: StringFieldUpdateOperationsInput | string
    guestSessionId?: StringFieldUpdateOperationsInput | string
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ArticleCreateManyClusterInput = {
    id?: string
    title: string
    content: string
    summary?: string | null
    summaryFr?: string | null
    summaryRw?: string | null
    imageUrl?: string | null
    originalLanguage?: string
    source: string
    url: string
    category?: string | null
    continent?: string | null
    region?: string | null
    country?: string | null
    publishedAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ArticleUpdateWithoutClusterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedBy?: SavedArticleUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateWithoutClusterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    savedBy?: SavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    readingHistory?: ReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
    guestSaves?: GuestSavedArticleUncheckedUpdateManyWithoutArticleNestedInput
    guestReadingHistory?: GuestReadingHistoryUncheckedUpdateManyWithoutArticleNestedInput
  }

  export type ArticleUncheckedUpdateManyWithoutClusterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    summaryFr?: NullableStringFieldUpdateOperationsInput | string | null
    summaryRw?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    originalLanguage?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    continent?: NullableStringFieldUpdateOperationsInput | string | null
    region?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}