// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'member_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MemberCollection _$MemberCollectionFromJson(Map<String, dynamic> json) =>
    MemberCollection(
      values: (json['values'] as List<dynamic>)
          .map((e) => MemberEntry.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$MemberCollectionToJson(MemberCollection instance) =>
    <String, dynamic>{'values': instance.values};
