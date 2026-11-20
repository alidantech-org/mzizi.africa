// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'resolution.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExplorerResolution _$ExplorerResolutionFromJson(Map<String, dynamic> json) => ExplorerResolution(
  candidates: (json['candidates'] as List<dynamic>).map((e) => ExplorerPlace.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  status: $enumDecode(_$ExplorerResolutionStatusEnumMap, json['status']),
);

Map<String, dynamic> _$ExplorerResolutionToJson(ExplorerResolution instance) => <String, dynamic>{
  'candidates': instance.candidates,
  'gaps': instance.gaps,
  'status': _$ExplorerResolutionStatusEnumMap[instance.status]!,
};

const _$ExplorerResolutionStatusEnumMap = {
  ExplorerResolutionStatus.ambiguous: 'ambiguous',
  ExplorerResolutionStatus.matched: 'matched',
  ExplorerResolutionStatus.unresolved: 'unresolved',
};
