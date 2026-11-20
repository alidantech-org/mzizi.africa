import 'package:json_annotation/json_annotation.dart';

part 'navigation_input.g.dart';

/// Navigation Input
@JsonSerializable(includeIfNull: false)
class ExplorerNavigationInput {
  const ExplorerNavigationInput({required this.countryCode});
  final String countryCode;

  factory ExplorerNavigationInput.fromJson(Map<String, dynamic> json) => _$ExplorerNavigationInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerNavigationInputToJson(this);
}
