import 'package:json_annotation/json_annotation.dart';

part 'flag_color.g.dart';

/// Flag Color
@JsonSerializable(includeIfNull: false)
class ExplorerFlagColor {
  const ExplorerFlagColor({required this.hex, required this.label, required this.share});
  final String hex;
  final String label;
  final double share;

  factory ExplorerFlagColor.fromJson(Map<String, dynamic> json) => _$ExplorerFlagColorFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerFlagColorToJson(this);
}
