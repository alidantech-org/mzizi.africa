import 'package:json_annotation/json_annotation.dart';

part 'copy_input.g.dart';

/// Copy Input
@JsonSerializable(includeIfNull: false)
class ExperienceCopyInput {
  const ExperienceCopyInput({this.countryCode, this.languageCode, this.prefix});
  final String? countryCode;
  final String? languageCode;
  final String? prefix;

  factory ExperienceCopyInput.fromJson(Map<String, dynamic> json) => _$ExperienceCopyInputFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCopyInputToJson(this);
}
