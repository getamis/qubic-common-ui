import React, { ReactElement, ReactNode, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  FlatList,
  SectionListData,
  SectionListRenderItem,
  ListRenderItem,
  VirtualizedListWithoutRenderItemProps,
} from 'react-native';
import { useOverride, TStyle } from '@qubic-js/react-native-cask-ui-theme';

const defaultStyles = StyleSheet.create({
  defaultHeaderPlaceholder: {
    height: 32,
  },
  groupedHeaderText: {
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 15,
    lineHeight: 20,
  },
  groupedFooterText: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 14,
    lineHeight: 19,
  },
  plainHeaderText: {
    paddingTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionSeparator: {
    height: StyleSheet.hairlineWidth,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
  },
  itemSeparatorInset: {
    backgroundColor: 'white',
  },
});

export type SectionData<ItemT> =
  | SectionListData<ItemT>
  | {
      headerTitle?: string;
      headerView?: ReactNode;
      footerTitle?: string;
      footerView?: ReactNode;
      data: ItemT[];
      tag?: string;
    }
  | null;

export interface ListProps<ItemT> extends VirtualizedListWithoutRenderItemProps<ItemT> {
  variant?: string;
  sectionType: 'plain' | 'grouped';
  renderSectionHeader?: (info: { section: SectionListData<ItemT> }, sectionHeader: ReactElement) => ReactElement | null;
  renderSectionFooter?: (info: { section: SectionListData<ItemT> }, sectionFooter: ReactElement) => ReactElement | null;
  renderItem: SectionListRenderItem<ItemT> | ListRenderItem<ItemT>;
  keyExtractor: (item: any, index: number) => string;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  sections?: SectionData<ItemT>[] | null;
  data?: ItemT[] | null;
  contentContainerStyle?: TStyle;
}

function ListBase<ItemT>(props: ListProps<ItemT> & { ref?: React.Ref<FlatList> }, ref: any): JSX.Element | null {
  const { props: overridedProps, styles } = useOverride<ListProps<ItemT>>('List', props);
  const {
    contentContainerStyle,
    sectionType = 'plain',
    sections,
    data,
    renderSectionHeader: originRenderSectionHeader,
    renderSectionFooter: originRenderSectionFooter,
    renderItem,
    ...otherProps
  } = overridedProps;

  const renderSectionHeader = useCallback(
    ({ section }) => {
      if (section.headerView) return section.headerView;

      const finalDefaultHeaderPlaceholderStyle = [
        defaultStyles.defaultHeaderPlaceholder,
        styles.defaultHeaderPlaceholder,
      ];
      const finalGroupedHeaderTextStyle = [defaultStyles.groupedHeaderText, styles.groupedHeaderText];
      const finalPlainHeaderTextStyle = [defaultStyles.plainHeaderText, styles.plainHeaderText];
      const finalSectionSeparatorStyle = [defaultStyles.sectionSeparator, styles.sectionSeparator];

      let sectionHeader = <View style={finalDefaultHeaderPlaceholderStyle} />;

      if (sectionType === 'grouped' && section.headerTitle) {
        sectionHeader = (
          <View>
            <Text style={finalGroupedHeaderTextStyle}>{section.headerTitle}</Text>
          </View>
        );
      }

      if (sectionType === 'plain') {
        if (!section.headerTitle) {
          sectionHeader = <View style={finalSectionSeparatorStyle} />;
        }
        sectionHeader = (
          <View style={{ marginTop: -2 }}>
            <View style={finalSectionSeparatorStyle} />
            <Text style={finalPlainHeaderTextStyle}>{section.headerTitle}</Text>
            <View style={finalSectionSeparatorStyle} />
          </View>
        );
      }

      return originRenderSectionHeader ? originRenderSectionHeader({ section }, sectionHeader) : sectionHeader;
    },
    [originRenderSectionHeader, styles, sectionType],
  );

  const renderSectionFooter = useCallback(
    ({ section }: { section: SectionData<ItemT> }) => {
      if (!section) return null;
      if (section.footerView) return section.footerView;

      const finalGroupedFooterTextStyle = [defaultStyles.groupedFooterText, styles.groupedFooterText];

      let sectionFooter = <View style={{ height: 0 }} />;

      if (sectionType === 'grouped' && section.footerTitle) {
        sectionFooter = (
          <View>
            <Text style={finalGroupedFooterTextStyle}>{section.footerTitle}</Text>
          </View>
        );
      }

      return originRenderSectionFooter ? originRenderSectionFooter({ section }, sectionFooter) : sectionFooter;
    },
    [originRenderSectionFooter, styles, sectionType],
  );

  const renderSectionSeparator = useCallback(() => {
    const finalSectionSeparatorStyle = [defaultStyles.sectionSeparator, styles.sectionSeparator];

    return <View style={finalSectionSeparatorStyle} />;
  }, [styles]);

  const renderItemSeparator = useCallback(() => {
    const finalItemSeparatorStyle = [defaultStyles.itemSeparator, styles.itemSeparator];
    const finalItemSeparatorInsetStyle = [defaultStyles.itemSeparatorInset, styles.itemSeparatorInset];

    return (
      <View style={finalItemSeparatorInsetStyle}>
        <View style={finalItemSeparatorStyle} />
      </View>
    );
  }, [styles]);

  // render
  if (sections) {
    // remove empty section or data
    const newSections = sections
      .filter(section => !!section)
      .map(section => {
        const { data: sd, ...others } = section || {};
        return {
          ...others,
          data: (sd || []).filter(d => !!d),
        };
      });

    return (
      <SectionList
        sections={newSections}
        stickySectionHeadersEnabled={sectionType === 'plain'}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        SectionSeparatorComponent={sectionType === 'plain' ? null : renderSectionSeparator}
        ItemSeparatorComponent={renderItemSeparator}
        contentContainerStyle={[
          sectionType === 'grouped'
            ? {
                paddingBottom: 64,
              }
            : {},
          contentContainerStyle,
        ]}
        renderItem={renderItem as SectionListRenderItem<ItemT>}
        {...otherProps}
        ref={ref}
      />
    );
  }

  if (data) {
    // remove empty data
    const newData = data.filter(d => !!d);

    return (
      <FlatList
        data={newData}
        ItemSeparatorComponent={renderItemSeparator}
        contentContainerStyle={contentContainerStyle}
        renderItem={renderItem as ListRenderItem<ItemT>}
        {...otherProps}
        ref={ref}
      />
    );
  }

  return null;
}

const List = React.memo(React.forwardRef(ListBase)) as typeof ListBase;

export default List;
