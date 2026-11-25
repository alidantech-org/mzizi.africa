// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bill_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureBillWindow _$LegislatureBillWindowFromJson(Map<String, dynamic> json) => LegislatureBillWindow(
  institutionId: json['institutionId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  statusTerm: json['statusTerm'] as String?,
);

Map<String, dynamic> _$LegislatureBillWindowToJson(LegislatureBillWindow instance) => <String, dynamic>{
  'institutionId': instance.institutionId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'statusTerm': ?instance.statusTerm,
};
