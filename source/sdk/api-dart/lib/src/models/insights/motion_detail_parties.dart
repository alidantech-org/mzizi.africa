import 'package:json_annotation/json_annotation.dart';

part 'motion_detail_parties.g.dart';

/// Motion Detail Parties
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailParties {
  const InsightsMotionDetailParties({required this.absent, required this.abstain, required this.no, required this.party, required this.yes});
  final double absent;
  final double abstain;
  final double no;
  final String party;
  final double yes;

  factory InsightsMotionDetailParties.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailPartiesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailPartiesToJson(this);
}
