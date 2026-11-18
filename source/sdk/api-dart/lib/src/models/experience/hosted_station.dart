import 'package:json_annotation/json_annotation.dart';

part 'hosted_station.g.dart';

/// Hosted Station
@JsonSerializable(includeIfNull: false)
class ExperienceHostedStation {
  const ExperienceHostedStation({
    this.ballotsCast,
    required this.electionCode,
    required this.electionYear,
    this.registeredVoters,
    required this.stationName,
    required this.statusLabel,
    this.streamCount,
  });
  final int? ballotsCast;
  final String electionCode;
  final int electionYear;
  final int? registeredVoters;
  final String stationName;
  final String statusLabel;
  final int? streamCount;

  factory ExperienceHostedStation.fromJson(Map<String, dynamic> json) => _$ExperienceHostedStationFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceHostedStationToJson(this);
}
