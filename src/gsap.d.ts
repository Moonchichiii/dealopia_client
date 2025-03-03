declare module 'gsap' {
    export * from 'gsap/gsap-core';
    
    export const gsap: typeof import('gsap/gsap-core').gsap;
    
    export interface GSAPStatic {
        registerPlugin(...args: any[]): void;
        config(config: object): void;
        context(func: Function): import('gsap').Context;
    }
}

declare module 'gsap/MorphSVGPlugin' {
    import { Plugin } from 'gsap/gsap-core';
    export class MorphSVGPlugin extends Plugin {}
    export const MorphSVGPlugin: MorphSVGPlugin;
}

declare module 'gsap/ScrollTrigger' {
    import { Plugin } from 'gsap/gsap-core';
    export class ScrollTrigger extends Plugin {}
    export const ScrollTrigger: ScrollTrigger;
}

declare module 'gsap/ScrollSmoother' {
    import { Plugin } from 'gsap/gsap-core';
    export class ScrollSmoother extends Plugin {}
    export const ScrollSmoother: ScrollSmoother;
}

declare module 'gsap/SplitText' {
    import { Plugin } from 'gsap/gsap-core';
    export class SplitText extends Plugin {}
    export const SplitText: SplitText;
}

declare module 'gsap/Observer' {
    import { Plugin } from 'gsap/gsap-core';
    export class Observer extends Plugin {}
    export const Observer: Observer;
}

declare module 'gsap/ScrollToPlugin' {
    import { Plugin } from 'gsap/gsap-core';
    export class ScrollToPlugin extends Plugin {}
    export const ScrollToPlugin: ScrollToPlugin;
}

declare module 'gsap/Draggable' {
    import { Plugin } from 'gsap/gsap-core';
    export class Draggable extends Plugin {}
    export const Draggable: Draggable;
}

declare module 'gsap/Flip' {
    import { Plugin } from 'gsap/gsap-core';
    export class Flip extends Plugin {}
    export const Flip: Flip;
}