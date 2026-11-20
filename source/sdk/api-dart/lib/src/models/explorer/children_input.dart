import 'package:json_annotation/json_annotation.dart';

part 'children_input.g.dart';

/// Children Input
@JsonSerializable(includeIfNull: false)
class ExplorerChildrenInput {
  const ExplorerChildrenInput({required this.countryCode, this.featureId, this.languageCode, this.limit, this.page});
  final String countryCode;
  final String? featureId;
  final String? languageCode;
  final int? limit;
  final int? page;

  factory ExplorerChildrenInput.fromJson(Map<String, dynamic> json) => _$ExplorerChildrenInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerChildrenInputToJson(this);
}
