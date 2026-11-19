// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manifesto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerManifesto _$LedgerManifestoFromJson(Map<String, dynamic> json) => LedgerManifesto(
  code: json['code'] as String,
  election: json['election'] as String?,
  party: json['party'] as String?,
  publishedOn: json['publishedOn'] as String?,
);

Map<String, dynamic> _$LedgerManifestoToJson(LedgerManifesto instance) => <String, dynamic>{
  'code': instance.code,
  'election': ?instance.election,
  'party': ?instance.party,
  'publishedOn': ?instance.publishedOn,
};
