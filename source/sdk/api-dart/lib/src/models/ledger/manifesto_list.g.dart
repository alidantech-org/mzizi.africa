// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manifesto_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerManifestoList _$LedgerManifestoListFromJson(Map<String, dynamic> json) => LedgerManifestoList(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  manifestos: (json['manifestos'] as List<dynamic>).map((e) => LedgerManifesto.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$LedgerManifestoListToJson(LedgerManifestoList instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'manifestos': instance.manifestos,
};
