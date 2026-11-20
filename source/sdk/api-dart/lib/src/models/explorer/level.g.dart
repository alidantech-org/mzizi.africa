// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'level.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerLevel _$ExplorerLevelFromJson(Map<String, dynamic> json) =>
    ExplorerLevel(depth: (json['depth'] as num).toInt(), kindCode: json['kindCode'] as String, label: json['label'] as String);

Map<String, dynamic> _$ExplorerLevelToJson(ExplorerLevel instance) => <String, dynamic>{
  'depth': instance.depth,
  'kindCode': instance.kindCode,
  'label': instance.label,
};
