// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'copy_bundle.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendCopyBundle _$FrontendCopyBundleFromJson(Map<String, dynamic> json) => FrontendCopyBundle(
  language: json['language'] as String,
  messages: (json['messages'] as List<dynamic>).map((e) => FrontendMessage.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$FrontendCopyBundleToJson(FrontendCopyBundle instance) => <String, dynamic>{
  'language': instance.language,
  'messages': instance.messages,
};
