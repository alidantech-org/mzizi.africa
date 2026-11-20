import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/explorer/resolution_status.dart';
import 'package:mzizi_api/src/models/explorer/place.dart';

part 'resolution.g.dart';

/// Resolution
@JsonSerializable(includeIfNull: false)
class ExplorerResolution {
  const ExplorerResolution({required this.candidates, required this.gaps, required this.status});
  final List<ExplorerPlace> candidates;
  final List<String> gaps;
  final ExplorerResolutionStatus status;

  factory ExplorerResolution.fromJson(Map<String, dynamic> json) => _$ExplorerResolutionFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerResolutionToJson(this);
}
