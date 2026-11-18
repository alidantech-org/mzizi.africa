import 'package:json_annotation/json_annotation.dart';

part 'election_input.g.dart';

/// Election Input
@JsonSerializable(includeIfNull: false)
class InsightsElectionInput {
  const InsightsElectionInput({this.contestKind, required this.electionId, this.parentFeatureId});
  final String? contestKind;
  final String electionId;
  final String? parentFeatureId;

  factory InsightsElectionInput.fromJson(Map<String, dynamic> json) => _$InsightsElectionInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionInputToJson(this);
}
