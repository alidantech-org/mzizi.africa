// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductMessageCollection _$ProductMessageCollectionFromJson(Map<String, dynamic> json) => ProductMessageCollection(
  messages: (json['messages'] as List<dynamic>).map((e) => ProductMessageEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$ProductMessageCollectionToJson(ProductMessageCollection instance) => <String, dynamic>{'messages': instance.messages};
