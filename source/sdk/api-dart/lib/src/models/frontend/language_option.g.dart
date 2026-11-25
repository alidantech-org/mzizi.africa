// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language_option.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendLanguageOption _$FrontendLanguageOptionFromJson(Map<String, dynamic> json) => FrontendLanguageOption(
  code: json['code'] as String,
  direction: $enumDecode(_$SharedTextDirectionEnumMap, json['direction']),
  name: SharedLocalizedText.fromJson(json['name'] as Map<String, dynamic>),
  tag: json['tag'] as String,
);

Map<String, dynamic> _$FrontendLanguageOptionToJson(FrontendLanguageOption instance) => <String, dynamic>{
  'code': instance.code,
  'direction': _$SharedTextDirectionEnumMap[instance.direction]!,
  'name': instance.name,
  'tag': instance.tag,
};

const _$SharedTextDirectionEnumMap = {SharedTextDirection.ltr: 'ltr', SharedTextDirection.rtl: 'rtl'};
