// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'effect_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalEffectCollection _$LegalEffectCollectionFromJson(Map<String, dynamic> json) =>
    LegalEffectCollection(effects: (json['effects'] as List<dynamic>).map((e) => LegalEffectEntry.fromJson(e as Map<String, dynamic>)).toList());

Map<String, dynamic> _$LegalEffectCollectionToJson(LegalEffectCollection instance) => <String, dynamic>{'effects': instance.effects};
