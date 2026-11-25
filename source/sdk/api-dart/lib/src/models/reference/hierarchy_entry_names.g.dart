// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hierarchy_entry_names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceHierarchyEntryNames _$ReferenceHierarchyEntryNamesFromJson(Map<String, dynamic> json) => ReferenceHierarchyEntryNames(
  fromYear: (json['fromYear'] as num?)?.toInt(),
  isDefault: json['isDefault'] as bool,
  kindTerm: json['kindTerm'] as String,
  languageCode: json['languageCode'] as String,
  languageIso: json['languageIso'] as String?,
  text: json['text'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReferenceHierarchyEntryNamesToJson(ReferenceHierarchyEntryNames instance) => <String, dynamic>{
  'fromYear': ?instance.fromYear,
  'isDefault': instance.isDefault,
  'kindTerm': instance.kindTerm,
  'languageCode': instance.languageCode,
  'languageIso': ?instance.languageIso,
  'text': instance.text,
  'toYear': ?instance.toYear,
};
