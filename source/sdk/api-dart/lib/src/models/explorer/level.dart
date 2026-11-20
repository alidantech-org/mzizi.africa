import 'package:json_annotation/json_annotation.dart';

part 'level.g.dart';

/// Level
@JsonSerializable(includeIfNull: false)
class ExplorerLevel {
  const ExplorerLevel({required this.depth, required this.kindCode, required this.label});
  final int depth;
  final String kindCode;
  final String label;

  factory ExplorerLevel.fromJson(Map<String, dynamic> json) => _$ExplorerLevelFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerLevelToJson(this);
}
