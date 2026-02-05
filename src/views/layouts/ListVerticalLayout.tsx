import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Tooltip from '@mui/material/Tooltip'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Fragment, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import { VerticalItems } from 'src/configs/layout'

type MenuItem = {
  title: string
  icon: string
  text: string
  path?: string
  children?: MenuItem[]
}

type MenuItemProps = {
  item: MenuItem
  level: number
  openItems: { [key: string]: boolean }
  handleClick: (title: string) => void
  mini?: boolean
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, level, openItems, handleClick, mini = false }) => {
  const router = useRouter()
  const hasChildren = item.children && item.children.length > 0

  const handleItemClick = () => {
    if (hasChildren) {
      handleClick(item.title)
    } else if (item.path) {
      // Thay đổi path để navigate trong cùng trang admin
      // /admin/orders -> /admin?page=orders
      const pathName = item.path.split('/').pop()
      router.push(`/admin/${pathName}`)
    }
  }

  const menuItem = (
    <ListItemButton
      onClick={handleItemClick}
      sx={{
        px: mini && level === 0 ? 0 : 2,
        py: 1,
        my: mini && level === 0 ? 0.5 : 0,
        justifyContent: mini && level === 0 ? 'center' : 'flex-start',
        pl: !mini ? (level > 0 ? 8 + level * 2 : 4) : 0,
        mb: 2,
        cursor: item.path ? 'pointer' : 'default'
      }}
    >
      {level === 0 && item.icon && (
        <ListItemIcon
          sx={{
            minWidth: mini ? 'auto' : 40,
            justifyContent: 'center',
            mr: mini ? 0 : 1
          }}
        >
          <IconifyIcon icon={item.icon} />
        </ListItemIcon>
      )}
      {!mini && (
        <>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: level === 0 ? '0.9rem' : '0.85rem',
              fontWeight: level === 0 ? 500 : 400
            }}
          />
          {hasChildren && (openItems[item.title] ? <ExpandLess /> : <ExpandMore />)}
        </>
      )}
    </ListItemButton>
  )

  return (
    <Fragment>
      {mini && level === 0 ? (
        <Tooltip title={item.text} placement='right'>
          {menuItem}
        </Tooltip>
      ) : (
        menuItem
      )}

      {hasChildren && !mini && (
        <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {item.children?.map((child, childIndex) => (
              <MenuItemComponent
                key={childIndex}
                item={child}
                level={level + 1}
                openItems={openItems}
                handleClick={handleClick}
                mini={mini}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  )
}

type Props = {
  mini?: boolean
}

const ListVerticalLayout: NextPage<Props> = ({ mini = false }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({
    Products: true
  })

  const handleClick = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <List component='nav'>
      <Divider />
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          '& .sidebar-hover-content': {
            opacity: mini ? 0 : 1,
            visibility: mini ? 'hidden' : 'visible',
            transition: 'all 0.2s'
          }
        }}
        component='nav'
        aria-labelledby='nested-list-subheader'
      >
        {VerticalItems?.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item!}
            level={0}
            openItems={openItems}
            handleClick={handleClick}
            mini={mini}
          />
        ))}
      </List>
    </List>
  )
}

export default ListVerticalLayout
