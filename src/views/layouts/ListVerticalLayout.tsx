import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import { NextPage } from 'next'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Fragment, useState } from 'react'
import IconifyIcon from 'src/components/Icon'
import { VerticalItems } from 'src/configs/layout'

type Props = {}

const ListVerticalLayout: NextPage<Props> = () => {
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
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component='nav'
        aria-labelledby='nested-list-subheader'
      >
        {VerticalItems?.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0

          return (
            <Fragment key={index}>
              <ListItemButton onClick={() => hasChildren && handleClick(item.title)}>
                <ListItemIcon>
                  <IconifyIcon icon={item.icon} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {hasChildren ? openItems[item.title] ? <ExpandLess /> : <ExpandMore /> : null}
              </ListItemButton>

              {hasChildren && (
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {item.children?.map((child, childIndex) => (
                      <ListItemButton key={childIndex} sx={{ pl: 10 }}>
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: 400
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Fragment>
          )
        })}
      </List>
    </List>
  )
}

export default ListVerticalLayout
