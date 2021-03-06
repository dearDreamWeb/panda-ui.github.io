import React, { useState, createContext } from "react";
import "./index.scss";
import classnames from "classnames";
import MenuItem from "./MenuItem";
import { AllMenuItemProps } from "./MenuItem";
import SubMenu, { allSubMenuProps } from "./SubMenu";
import MenuGroup, { allMenuGroupProps } from "./MenuGroup";


type MenuMode = "horizontal" | "vertical";
type SelectCallback = (selectIndex: string) => void;
// Menu组件的参数
export interface MenuProps {
    defaultIndex?: string;
    className?: string;
    mode?: MenuMode;
    style?: React.CSSProperties;
    onSelect?: SelectCallback;
    children?: React.ReactNode;
    defaultOpenKeys?: string[];  // 默认打开哪些SubMenu菜单
}

// 定义传入子组件参数context
interface IMenuContext {
    index: string;
    onSelect?: SelectCallback;
    mode?: string;
    defaultOpenKeys?: string[];  // 默认打开哪些SubMenu菜单
}
// 导出父组件的createContext
export const MenuContext = createContext<IMenuContext>({ index: "0" })

type AllMenuProps = MenuProps & React.HTMLAttributes<HTMLElement>;



// Menu组件
const Menu: React.FC<AllMenuProps> = props => {
    const { className, mode, style, defaultIndex, children, onSelect, defaultOpenKeys, ...restProps } = props;
    const [activeIndex, setActiveIndex] = useState(defaultIndex);
    const classes = classnames("pa-menu", className, {
        [`menu-${mode}`]: true
    })

    // 渲染子组件
    const renderChildren = () => {
        return React.Children.map(children, (child, index) => {
            const childEl = child as React.FunctionComponentElement<AllMenuItemProps>;
            const { displayName } = childEl.type ? childEl.type : { displayName: "" };
            if (displayName === "MenuItem" || displayName === "SubMenu") {
                // 克隆一个childEl元素，添加参数index
                return React.cloneElement(childEl, { index: index.toString() });
            } else if (displayName === "MenuGroup" && mode === "vertical") {
                // MenuGroup只存在于mode为vertical模式，或者SubMenu组件中
                return React.cloneElement(childEl, { index: index.toString() });
            }
            else {
                console.error("Warning: Menu has a child which is not a MenuItem component");
            }
        })
    }


    // 点击事件回调
    const handleClick = (index: string) => {
        setActiveIndex(index);
        if (onSelect) {
            onSelect(index);
        }
    }
    // 传入context的值
    const passedContext: IMenuContext = {
        index: activeIndex ? activeIndex : "0",
        onSelect: handleClick,
        mode,
        defaultOpenKeys
    }
    return (
        <ul className={classes} style={style} {...restProps} data-testid="test-menu">
            <MenuContext.Provider value={passedContext}>
                {renderChildren()}
            </MenuContext.Provider>
        </ul>
    )
}

MenuItem.displayName = "MenuItem";

// Menu组件的默认参数 
Menu.defaultProps = {
    defaultIndex: "0",
    defaultOpenKeys: [],
    mode: "horizontal"
}

// 把SubMenu组件、MenuItem组件、MenuGroup组件变成Menu.Item等形式
type ItemMenuComponent = React.FC<AllMenuProps> & {
    Item: React.FC<AllMenuItemProps>,
    SubMenu: React.FC<allSubMenuProps>,
    Group: React.FC<allMenuGroupProps>
}
const TransMenu = Menu as ItemMenuComponent;
TransMenu.Item = MenuItem;
TransMenu.SubMenu = SubMenu;
TransMenu.Group = MenuGroup;
export default TransMenu;