import type { ComponentType } from "react"

export function withMobileHorizontalScroll(Component): ComponentType {
    return (props) => {
        return (
            <>
                <style>{`
                    .g2-mobile-filter-scroll {
                        scrollbar-width: none;
                        -webkit-overflow-scrolling: touch;
                    }

                    .g2-mobile-filter-scroll::-webkit-scrollbar {
                        display: none;
                    }

                    .g2-mobile-filter-scroll > * {
                        flex-shrink: 0 !important;
                    }
                `}</style>

                <Component
                    {...props}
                    className={`${props.className ?? ""} g2-mobile-filter-scroll`}
                    style={{
                        ...props.style,
                        width: "100%",
                        maxWidth: "100%",
                        overflowX: "auto",
                        overflowY: "hidden",
                        flexWrap: "nowrap",
                    }}
                />
            </>
        )
    }
}
