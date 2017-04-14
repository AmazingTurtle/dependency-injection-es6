
const bindings = new Map();
const singletons = new Map();
const DEPENDENCIES = Symbol('DEPENDENCIES');

export default class Container {

    static bind(iClass,Class,options){
        bindings.set(iClass,Class);
        if(options && options.singleton){
            this.registerAsSingleton(Class);
        }
    }

    static getInstanceOf(clazz, ...params){
        if(bindings.has(clazz)){
            clazz = bindings.get(clazz);
            return this.resolve(clazz, ...params);
        }
        return this.resolve(clazz, ...params);
    }

    static resolve(clazz, ...params){
        if(singletons.has(clazz)) {
            return this.resolveSingleton(clazz, ...params);
        }
        return this.resolveInstance(clazz, ...params);

    }

    static resolveInstance(clazz, ...params){
        if(typeof clazz !="function") throw new Error(`${clazz} must be class not a ${typeof clazz}`);
        let classes = clazz[DEPENDENCIES] || [];
        let dependencies = classes.map(this.getInstanceOf.bind(this));
        return new clazz(...dependencies, ...params);
    }



    static registerAsSingleton(clazz) {
        if(!singletons.has(clazz)) {
            singletons.set(clazz, null);
        }
    }

    static resolveSingleton(clazz) {
        if(singletons.get(clazz) === null) {
            singletons.set(clazz, this.resolveInstance(clazz));
        }
        return singletons.get(clazz);
    }

    static registerDependencies(clazz, ...dependencies) {
        clazz[DEPENDENCIES] = dependencies
    }

}
