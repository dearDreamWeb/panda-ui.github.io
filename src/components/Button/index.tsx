import React from "react";
import "./index.scss";
import classnames from "classnames";


// button的尺寸
enum ButtonSize {
    Large = "lg",
    Small = "sm"
}

// button的类型
enum ButtonType {
    Primary = "primary",
    Default = "default",
    Danger = "danger",
    Warning = "warning",
    Link = "link"     // 链接类型
}

// button的参数
interface BaseButtonProps {
    className?: string,
    disabled?: boolean,
    size?: ButtonSize,
    btnType?: ButtonType,
    children?: React.ReactNode,
    href?: string
}
// 联合BaseButtonProps的属性和button标签的原生属性
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>;
// 联合BaseButtonProps的属性和a标签的原生属性
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>;
// partial将所有属性都定义为可选
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

const Button: React.FC<ButtonProps> = props => {
    const { disabled, size, className, btnType, children, href, ...restProps } = props;
    const classes = classnames("btn", className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        "disabled": btnType === ButtonType.Link && disabled
    })
    // 判断是否为link类型，是的话就是a标签，不是就是button标签
    if (btnType === ButtonType.Link) {
        return (
            <span
                className={classes}
                {...restProps}
            >
                <a href={href}>
                    {children}</a>
            </span>
        )
    } else {
        return (
            <button
                className={classes}
                disabled={disabled}
                {...restProps}
            >
                {children}
            </button>
        )
    }
}

Button.defaultProps = {
    disabled: false,
    btnType: ButtonType.Default
}

export default Button;
export { ButtonSize, ButtonType };