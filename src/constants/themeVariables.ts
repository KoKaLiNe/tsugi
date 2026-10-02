import type { GlobalThemeOverrides } from "naive-ui";

const basicTheme = {
    borderRadius: '6px',
}

const componentsTheme = {
    Tag: {
        borderRadius: '6px',
    }
}

export const LIGHT_THEME: GlobalThemeOverrides = {
    ...componentsTheme,
    common: {
        ...basicTheme,

        primaryColor: '#7453C1',
        primaryColorHover: '#6544B0',
        primaryColorPressed: '#876CC6',
        primaryColorSuppl: '#7453C1',

        bodyColor: '#F7F5F6',

        cardColor: '#FFFFFF',
        modalColor: '#FFFFFF',
        popoverColor: '#FFFFFF',

        textColorBase: '#141516',
        textColor1: '#242425',
        textColor2: '#464445',
        textColor3: '#6B6668',

        placeholderColor: '#6B6668',
        iconColor: '#6B6668',

        borderColor: 'rgba(36, 36, 37, .12)',
        dividerColor: 'rgba(36, 36, 37, .12)',

        buttonColor2: "#ffffff",
        buttonColor2Hover: "#e7e7e7",
        buttonColor2Pressed: "#d1d1d1",

        successColor: '#128046',
        successColorHover: '#0E6437',
        successColorPressed: '#0A4A29',

        errorColor: '#C0392B',
        errorColorHover: '#A63125',
        errorColorPressed: '#8E2A20',
    }
}
export const DARK_THEME: GlobalThemeOverrides = {
    ...componentsTheme,
    common: {
        ...basicTheme,

        primaryColor: '#9173d9',
        primaryColorHover: '#A68DE0',
        primaryColorPressed: '#856BC4',
        primaryColorSuppl: '#50378E',

        bodyColor: '#1A1A1B',

        cardColor: '#242425',
        modalColor: '#242425',
        popoverColor: '#242425',

        textColorBase: '#F5EDEF',
        textColor1: '#E2DBDD',
        textColor2: '#BDB7B9',
        textColor3: '#9A9496',

        placeholderColor: '#9A9496',
        iconColor: '#9A9496',

        borderColor: 'rgba(226,219,221,.14)',
        dividerColor: 'rgba(226,219,221,.14)',

        buttonColor2: "#7453C1",
        buttonColor2Hover: "#6544B0",
        buttonColor2Pressed: "#876CC6",

        successColor: '#5DBE8E',
        successColorHover: '#70C69B',
        successColorPressed: '#81CCA7',

        errorColor: '#E8705F',
        errorColorHover: '#EB8577',
        errorColorPressed: '#EE978B',
    }
}