// @flow
import React from 'react';

import type { Module } from 'app/store/entities/sandboxes/modules/entity';
import type {
  Directory,
} from 'app/store/entities/sandboxes/directories/entity';

import {
  validateTitle,
  isMainModule,
} from 'app/store/entities/sandboxes/modules/validator';

import Entry from './Entry';
import DirectoryEntry from './';

type Props = {
  depth: number,
  renameModule: (id: string, title: string) => boolean,
  directories: Array<Directory>,
  modules: Array<Module>,
  openMenu: (event: Event) => void,
  sandboxId: string,
  deleteEntry: (id: string) => void,
  setCurrentModule: (id: string) => void,
  currentModuleId: ?string,
  parentId: string,
};

export default class DirectoryChildren extends React.PureComponent {
  props: Props;

  validateTitle = (id: string, title: string) => {
    const { directories, modules } = this.props;
    return validateTitle(id, title, [...directories, ...modules]);
  };

  render() {
    const {
      depth = 0,
      renameModule,
      openMenu,
      setCurrentModule,
      directories,
      parentId,
      sandboxId,
      modules,
      deleteEntry,
      currentModuleId,
      isInProjectView,
    } = this.props;

    return (
      <div>
        {directories
          .filter(x => x.directoryShortid === parentId)
          .map(dir => (
            <DirectoryEntry
              key={dir.id}
              siblings={[...directories, ...modules]}
              depth={depth + 1}
              id={dir.id}
              title={dir.title}
              sandboxId={sandboxId}
              modules={modules}
              directories={directories}
              currentModuleId={currentModuleId}
              isInProjectView={isInProjectView}
            />
          ))}
        {modules.filter(x => x.directoryShortid === parentId).map(m => {
          const isActive = m.id === currentModuleId;
          const mainModule = isMainModule(m);
          return (
            <Entry
              key={m.id}
              id={m.id}
              title={m.title}
              depth={depth + 1}
              active={isActive}
              type={m.type}
              rename={!mainModule && renameModule}
              openMenu={openMenu}
              deleteEntry={!mainModule && deleteEntry}
              isNotSynced={m.isNotSynced}
              renameValidator={this.validateTitle}
              setCurrentModule={setCurrentModule}
              isInProjectView={isInProjectView}
              isMainModule={mainModule}
              moduleHasError={m.error && m.error.severity === 'error'}
            />
          );
        })}
      </div>
    );
  }
}