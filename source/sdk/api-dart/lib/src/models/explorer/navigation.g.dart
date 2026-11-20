// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'navigation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerNavigation _$ExplorerNavigationFromJson(Map<String, dynamic> json) => ExplorerNavigation(
  country: ExplorerCountryChoice.fromJson(json['country'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  items: (json['items'] as List<dynamic>).map((e) => ExplorerNavigationItem.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ExplorerNavigationToJson(ExplorerNavigation instance) => <String, dynamic>{
  'country': instance.country,
  'gaps': instance.gaps,
  'items': instance.items,
};
