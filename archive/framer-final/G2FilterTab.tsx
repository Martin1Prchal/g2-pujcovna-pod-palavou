import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Props = {
    label: string
    slug: string
    queryName: string
    isAll: boolean
    style?: React.CSSProperties
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight fixed
 */
export default function G2FilterTab(props: Props) {
    const { label, slug, queryName, isAll, style } = props
    const readValue = React.useCallback(() => {
        if (typeof window === "undefined") return ""
        return new URL(window.location.href).searchParams.get(queryName) || ""
    }, [queryName])
    const [current, setCurrent] = React.useState(readValue)

    React.useEffect(() => {
        const sync = () => setCurrent(readValue())
        window.addEventListener("popstate", sync)
        return () => window.removeEventListener("popstate", sync)
    }, [readValue])

    const active = isAll ? current === "" : current === slug
    const href = isAll ? "?" : "?" + encodeURIComponent(queryName) + "=" + encodeURIComponent(slug)

    const activate = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        const url = new URL(window.location.href)
        if (isAll) url.searchParams.delete(queryName)
        else url.searchParams.set(queryName, slug)
        window.history.pushState({}, "", url.pathname + url.search + url.hash)
        window.dispatchEvent(new PopStateEvent("popstate"))
        setCurrent(isAll ? "" : slug)
    }

    return (
        <a
            href={href}
            onClick={activate}
            aria-current={active ? "page" : undefined}
            style={{
                ...style,
                minHeight: 44,
                padding: "0 18px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "1px solid #d8cfc4",
                background: active ? "#b93f36" : "#fffdfa",
                color: active ? "#ffffff" : "#192334",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1,
                textDecoration: "none",
                whiteSpace: "nowrap",
                cursor: "pointer",
                boxSizing: "border-box",
            }}
        >
            {label}
        </a>
    )
}

G2FilterTab.defaultProps = {
    label: "Vše",
    slug: "",
    queryName: "category",
    isAll: false,
}

addPropertyControls(G2FilterTab, {
    label: { type: ControlType.String, title: "Label" },
    slug: { type: ControlType.String, title: "Slug" },
    queryName: { type: ControlType.String, title: "Query" },
    isAll: { type: ControlType.Boolean, title: "All" },
})
