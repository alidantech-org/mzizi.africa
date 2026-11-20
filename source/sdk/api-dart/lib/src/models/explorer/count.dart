import 'package:json_annotation/json_annotation.dart';

part 'count.g.dart';

/// Count
@JsonSerializable(includeIfNull: false)
class ExplorerCount {
  const ExplorerCount({required this.label, required this.value});
  final String label;
  final int value;

  factory ExplorerCount.fromJson(Map<String, dynamic> json) => _$ExplorerCountFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCountToJson(this);
}
