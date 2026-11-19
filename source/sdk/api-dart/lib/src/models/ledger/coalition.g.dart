// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coalition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerCoalition _$LedgerCoalitionFromJson(Map<String, dynamic> json) => LedgerCoalition(
  code: json['code'] as String,
  dissolvedOn: json['dissolvedOn'] as String?,
  formedOn: json['formedOn'] as String?,
  kind: json['kind'] as String,
  name: json['name'] as String,
);

Map<String, dynamic> _$LedgerCoalitionToJson(LedgerCoalition instance) => <String, dynamic>{
  'code': instance.code,
  'dissolvedOn': ?instance.dissolvedOn,
  'formedOn': ?instance.formedOn,
  'kind': instance.kind,
  'name': instance.name,
};
