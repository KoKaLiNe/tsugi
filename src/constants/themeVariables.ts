import type { GlobalThemeOverrides } from "naive-ui";

const basicTheme = {
    primaryColor: '#7453C1',
    primaryColorSuppl: '#7453C1',

    borderRadius: '6px',
}

export const LIGHT_THEME: GlobalThemeOverrides = {
    common: {
        ...basicTheme,

        primaryColorHover: '#6544B0',
        primaryColorPressed: '#876CC6',

        bodyColor: '#F7F5F6',

        cardColor: '#FFFFFF',
        modalColor: '#FFFFFF',
        popoverColor: '#FFFFFF',

        textColorBase: '#242425',
        textColor1: '#242425',
        textColor2: '#242425',

        textColor3: '#6B6668',
        placeholderColor: '#6B6668',
        iconColor: '#6B6668',

        borderColor: 'rgba(36, 36, 37, .12)',
        dividerColor: 'rgba(36, 36, 37, .12)',

        buttonColor2: "#ffffff",
        buttonColor2Hover: "#e7e7e7",
        buttonColor2Pressed: "#d1d1d1",

        successColor: '#2E7D5B',
        errorColor: '#C0392B',
    }
}
export const DARK_THEME: GlobalThemeOverrides = {
    common: {
        ...basicTheme,

        primaryColorHover: '#8261CE',
        primaryColorPressed: '#9073D3',

        bodyColor: '#1A1A1B',

        cardColor: '#242425',
        modalColor: '#242425',
        popoverColor: '#242425',

        textColorBase: '#E2DBDD',
        textColor1: '#E2DBDD',
        textColor2: '#E2DBDD',

        textColor3: '#9A9496',
        placeholderColor: '#9A9496',
        iconColor: '#9A9496',

        borderColor: 'rgba(226,219,221,.14)',
        dividerColor: 'rgba(226,219,221,.14)',

        /* TODO обновить цвета для темной темы */
        buttonColor2: "#ffffff",
        buttonColor2Hover: "#e7e7e7",
        buttonColor2Pressed: "#d1d1d1",

        successColor: '#5DBE8E',
        errorColor: '#E8705F',
    }
}