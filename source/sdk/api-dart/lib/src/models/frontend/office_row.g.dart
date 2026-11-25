// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_row.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendOfficeRow _$FrontendOfficeRowFromJson(Map<String, dynamic> json) => FrontendOfficeRow(
  fromYear: (json['fromYear'] as num?)?.toInt(),
  holder: json['holder'] == null ? null : SharedLocalizedText.fromJson(json['holder'] as Map<String, dynamic>),
  holderCode: json['holderCode'] as String?,
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
  office: json['office'] as String,
);

Map<String, dynamic> _$FrontendOfficeRowToJson(FrontendOfficeRow instance) => <String, dynamic>{
  'fromYear': ?instance.fromYear,
  'holder': ?instance.holder,
  'holderCode': ?instance.holderCode,
  'name': instance.name,
  'office': instance.office,
};
