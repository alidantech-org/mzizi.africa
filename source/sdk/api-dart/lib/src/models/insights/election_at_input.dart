import 'package:json_annotation/json_annotation.dart';

part 'election_at_input.g.dart';

/// Election At Input
@JsonSerializable(includeIfNull: false)
class InsightsElectionAtInput {
  const InsightsElectionAtInput({this.contestKind, required this.countryCode, required this.electionId, this.languageCode, this.path});
  final String? contestKind;
  final String countryCode;
  final String electionId;
  final String? languageCode;
  final String? path;

  factory InsightsElectionAtInput.fromJson(Map<String, dynamic> json) => _$InsightsElectionAtInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionAtInputToJson(this);
}
