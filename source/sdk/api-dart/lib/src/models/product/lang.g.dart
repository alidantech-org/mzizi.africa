// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lang.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductLang _$ProductLangFromJson(Map<String, dynamic> json) => ProductLang(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  position: (json['position'] as num).toInt(),
  releaseId: json['releaseId'] as String,
);

Map<String, dynamic> _$ProductLangToJson(ProductLang instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'position': instance.position,
  'releaseId': instance.releaseId,
};
