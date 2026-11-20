import 'package:json_annotation/json_annotation.dart';

part 'copy_input.g.dart';

/// Copy Input
@JsonSerializable(includeIfNull: false)
class ExplorerCopyInput {
  const ExplorerCopyInput({this.area, this.countryCode, required this.languageCode});
  final String? area;
  final String? countryCode;
  final String languageCode;

  factory ExplorerCopyInput.fromJson(Map<String, dynamic> json) => _$ExplorerCopyInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCopyInputToJson(this);
}
