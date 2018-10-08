interface JQuery {
    range(options?: {
          min: number
        , max: number
        , start?: number
        , step?: number
        , onChange?: (value: number, meta: {triggeredByUser: boolean}) => any
    }): any;
}
