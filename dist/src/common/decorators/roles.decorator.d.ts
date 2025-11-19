export declare enum Role {
    ADMIN = "ADMIN",
    SALES_REP = "SALES_REP"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
