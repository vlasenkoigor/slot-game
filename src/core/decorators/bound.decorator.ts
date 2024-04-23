// eslint-disable-next-line
export function Bound(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;

    // eslint-disable-next-line
    context.addInitializer(function (this: any) {
        this[methodName] = this[methodName].bind(this);
    });
}
