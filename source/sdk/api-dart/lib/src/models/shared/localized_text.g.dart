// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'localized_text.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedLocalizedText _$SharedLocalizedTextFromJson(Map<String, dynamic> json) => SharedLocalizedText(
  direction: $enumDecode(_$SharedTextDirectionEnumMap, json['direction']),
  isFallback: json['isFallback'] as bool,
  language: json['language'] as String,
  text: json['text'] as String,
);

Map<String, dynamic> _$SharedLocalizedTextToJson(SharedLocalizedText instance) => <String, dynamic>{
  'direction': _$SharedTextDirectionEnumMap[instance.direction]!,
  'isFallback': instance.isFallback,
  'language': instance.language,
  'text': instance.text,
};

const _$SharedTextDirectionEnumMap = {SharedTextDirection.ltr: 'ltr', SharedTextDirection.rtl: 'rtl'};
