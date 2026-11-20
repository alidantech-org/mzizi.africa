import 'package:json_annotation/json_annotation.dart';

part 'bootstrap_input.g.dart';

/// Bootstrap Input
@JsonSerializable(includeIfNull: false)
class ExplorerBootstrapInput {
  const ExplorerBootstrapInput({this.languageCode});
  final String? languageCode;

  factory ExplorerBootstrapInput.fromJson(Map<String, dynamic> json) => _$ExplorerBootstrapInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerBootstrapInputToJson(this);
}
