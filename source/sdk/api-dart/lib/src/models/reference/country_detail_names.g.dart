// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_detail_names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountryDetailNames _$ReferenceCountryDetailNamesFromJson(Map<String, dynamic> json) => ReferenceCountryDetailNames(
  fromYear: (json['fromYear'] as num?)?.toInt(),
  isDefault: json['isDefault'] as bool,
  kindTerm: json['kindTerm'] as String,
  languageCode: json['languageCode'] as String,
  languageIso: json['languageIso'] as String?,
  text: json['text'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReferenceCountryDetailNamesToJson(ReferenceCountryDetailNames instance) => <String, dynamic>{
  'fromYear': ?instance.fromYear,
  'isDefault': instance.isDefault,
  'kindTerm': instance.kindTerm,
  'languageCode': instance.languageCode,
  'languageIso': ?instance.languageIso,
  'text': instance.text,
  'toYear': ?instance.toYear,
};
