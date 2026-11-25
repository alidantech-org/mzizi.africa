// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hierarchy_entry_levels_names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceHierarchyEntryLevelsNames _$ReferenceHierarchyEntryLevelsNamesFromJson(Map<String, dynamic> json) => ReferenceHierarchyEntryLevelsNames(
  fromYear: (json['fromYear'] as num?)?.toInt(),
  isDefault: json['isDefault'] as bool,
  kindTerm: json['kindTerm'] as String,
  languageCode: json['languageCode'] as String,
  languageIso: json['languageIso'] as String?,
  text: json['text'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReferenceHierarchyEntryLevelsNamesToJson(ReferenceHierarchyEntryLevelsNames instance) => <String, dynamic>{
  'fromYear': ?instance.fromYear,
  'isDefault': instance.isDefault,
  'kindTerm': instance.kindTerm,
  'languageCode': instance.languageCode,
  'languageIso': ?instance.languageIso,
  'text': instance.text,
  'toYear': ?instance.toYear,
};
