"use client"
import React, { useState } from "react"
import { ChevronDown,ChevronRight, File, Folder } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Dropzone from "@/components/dropzone"
import { Button } from "./ui/button"
import { fileUtils } from "@/lib/file-utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface AppSidebarTreeItem {
  uuid: string;
  label: string;
  icon: React.ReactNode;
  fullPath: string;
  type: string;
  items?: AppSidebarTreeItem[]
  badge?: string;
  active?: boolean;
}

interface TreeProps extends React.HTMLAttributes<HTMLElement> {
  item: AppSidebarTreeItem;
  indent: number;
  onTreeItemClick: React.MouseEventHandler<HTMLElement>;
  isActiveItem: (itemId: string) => boolean;
  className?: string | undefined;
}

interface TreeItemTextProps extends React.HTMLAttributes<HTMLDivElement> {
  withBadge?: boolean;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItemIds, setActiveItemIds] = useState<string[]>([]);
  const [items, setItems] = useState<AppSidebarTreeItem[]>([]);

  const onTreeItemClick = (event: React.MouseEvent<HTMLElement>) => {
    const treeId = (event.target as HTMLElement).closest('button')?.getAttribute('tree-id');
    console.log(treeId);
    if (!treeId) return;
    setActiveItemIds([treeId]);
    setActiveItems(items, [treeId]);
  }

  const handleFolderPicker = async () => {
    try {
      const dirHandle = await window?.showDirectoryPicker();
      const files = await fileUtils.getFilesFromDirHandle(dirHandle);
      console.log(files);
      const items = files.map(file => file as AppSidebarTreeItem);
      setItems(items);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'AbortError') {
        alert('Error: showDirectoryPicker is not supported in your broswer!');
      }
      console.log(error);
    }
  }

  const handleFilePicker = async () => {
    try {
      const fileHandle = await window?.showOpenFilePicker();
      const files = await fileUtils.getFileFromFileHandle(fileHandle);
      console.log(files);
      const items = files.map(file => file as AppSidebarTreeItem);
      setItems(items);
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'AbortError') {
        alert('Error: showOpenFilePicker is not supported in your broswer!');
      }
      console.log(error);
    }
  }

  const handleFileDrop = async (dataTransferItems: DataTransferItemList) => {
    const files = await fileUtils.getFilesFromTransferItemList(dataTransferItems);
    const items = files.map(file => file as AppSidebarTreeItem);
    setItems(items);
    console.log(items);
  }

  const setActiveItems = (items: AppSidebarTreeItem[], activeItemIds: string[]) => {
    for (let i=0; i<items.length; i++) {
      const item = items[i];
      if (activeItemIds.includes(item.uuid)) {
        item.active = true;
        if (item.items) {
          setActiveItems(item.items, activeItemIds);
        }
      } else {
        item.active = false;
      }
    }
  }

  const isActiveItem = (itemId: string) => {
    return activeItemIds.includes(itemId);
  }

  return (
    <Dropzone onDrop={handleFileDrop}>
      <Sidebar variant="inset" {...props}>
        <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    FILES<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  {!!items.length ? <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((item, index) => (
                        <Tree key={index} item={item} onTreeItemClick={onTreeItemClick} indent={0} isActiveItem={isActiveItem}/>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent> :  <div className="flex gap-2 w-full flex-col">
                    <Button onClick={handleFilePicker}>Open File</Button>
                    <Button onClick={handleFolderPicker}>Open Folder</Button>
                    </div>}
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </Dropzone>
  )
}

const Tree: React.FC<TreeProps> = ({ item, indent, onTreeItemClick, isActiveItem, ...props }) => {
  if (item.type === 'file') {
    return (
      <SidebarMenuItem {...props}>
        <SidebarMenuButton
          tooltip={item.label}
          isActive={isActiveItem(item.uuid)}
          className="px-r-0"
          tree-id={item.uuid}
          onClick={onTreeItemClick}
        >
            {Array(indent).fill(0).map((_, index) => {
              return <div key={index} className="w-4 shrink-0"></div>;
            })}
            <File/>
            <TreeItemText withBadge={!!item.badge}>{item.label}</TreeItemText>
            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem {...props}>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-of-type]:rotate-90"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.label}
            isActive={isActiveItem(item.uuid)}
            tree-id={item.uuid}
            onClick={onTreeItemClick}
            className="px-r-0"
          >
            {Array(indent).fill(0).map((_, index) => {
              return <div key={index} className="w-4 shrink-0"></div>;
            })}
            <ChevronRight className="transition-transform" />
            <Folder/>
            <TreeItemText>{item.label}</TreeItemText>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="mt-1">
            {(item.items ?? []).map((subItem, index) => (
              <Tree key={index} item={subItem} onTreeItemClick={onTreeItemClick} indent={indent + 1} isActiveItem={isActiveItem}/>
            ))}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

const TreeItemText: React.FC<TreeItemTextProps> = ({ children, withBadge }) => {
  const tooltip = {
    children: children
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`truncate ${withBadge ? 'pr-4' : ''}`} >{children}</div>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        {...tooltip}
      />
    </Tooltip>
  );
}

