export const ASSETS = {
    LOGO: '/assets/black-logo.svg',
    HERO: {
        BG: '/assets/hero-bg.png',
        BAG: '/assets/bag.png',
        BACKGROUND: '/assets/hero/Background-Image.png',
        FOREGROUND: '/assets/hero/Foreground-Image.png',
        PRODUCT: '/assets/hero/Product-Image.png',
    },
    FRONT_BACK_SIDEWAYS: {
        IMAGE_1: '/assets/front-back-sideways/image-3.png',
        IMAGE_2: '/assets/front-back-sideways/image-2.png',
        IMAGE_3: '/assets/front-back-sideways/image-1.png',
    },
    TICKERS: {
        MAIN: '/assets/tickers/main.jpeg',
        MAIN2: '/assets/tickers/main2.jpeg',
        FIRST: '/assets/tickers/first.jpeg',
        SECOND: '/assets/tickers/second.jpeg',
        SIDE: '/assets/tickers/side.jpeg',
        IMG_354A7767: '/assets/tickers/354A7767.jpg',
        IMG_354A7762: '/assets/tickers/354A7762.jpg',
        IMG_354A7756: '/assets/tickers/354A7756.jpg',
        IMG_354A7724: '/assets/tickers/354A7724.jpg',
        IMG_354A7751: '/assets/tickers/354A7751.jpg',
    },
    ABOUT: {
        FEATURE: '/assets/about/Feature-Image.png',
        IMG_1ST: '/assets/about/1st-Image.png',
        IMG_2ND: '/assets/about/2nd-Image.png',
        IMG_3RD: '/assets/about/3rd-Image.png',
    },
    BENEFITS: {
        CARD_1ST: '/assets/benefits/1st-card.png',
        CARD_2ND: '/assets/benefits/2nd-card.png',
        CARD_3RD: '/assets/benefits/3rd-card.png',
        CARD_4TH: '/assets/benefits/4th-card.png',
        CARD_5TH: '/assets/benefits/5th-card.png',
    },
    NEW_PRODUCTS: {
        DSR: {
            POSTER: '/new-assets/dual-side-reversable/poster.png',
            MAIN: '/new-assets/dual-side-reversable/front-main.png',
            MODEL: '/new-assets/dual-side-reversable/model.png',
        },
        GREYSTONE: {
            POSTER: '/new-assets/greystone/poster.png',
            FRONT: '/new-assets/greystone/front.png',
            MODEL: '/new-assets/greystone/model.png',
        },
        TRAILBLAZER: {
            POSTER: '/new-assets/trail-blazer/poster.png',
            MAIN: '/new-assets/trail-blazer/main.png',
            FRONT: '/new-assets/trail-blazer/front.png',
            BACK: '/new-assets/trail-blazer/back.png',
        },
        FLAGSHIP: {
            MAIN: '/new-assets/flagship-main-product/main.png',
            FRONT: '/new-assets/flagship-main-product/front.png',
            MODEL: '/new-assets/flagship-main-product/model.png',
            FRONT_MODEL: '/new-assets/flagship-main-product/front-model.png',
            SIDE_MODEL: '/new-assets/flagship-main-product/side-model.png',
            OPEN: '/new-assets/flagship-main-product/open.png',
            SIDE_OPEN: '/new-assets/flagship-main-product/side-open.png',
            BACK: '/new-assets/flagship-main-product/back.png',
            MODEL_BACK: '/new-assets/flagship-main-product/model-back.png',
        },
    },
    VIDEOS: {
        HERO: '/assets/videos/hero.mp4',
        PRODUCT_MAIN: '/assets/videos/product-main-video.mp4',
    },
} as const;

export type Assets = typeof ASSETS;
