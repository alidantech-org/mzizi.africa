import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/explorer/context.dart';
import 'package:mzizi_api/src/models/explorer/count.dart';
import 'package:mzizi_api/src/models/explorer/places.dart';

part 'overview.g.dart';

/// Overview
@JsonSerializable(includeIfNull: false)
class ExplorerOverview {
  const ExplorerOverview({required this.children, required this.context, required this.counts, required this.gaps});
  final ExplorerPlaces children;
  final ExplorerContext context;
  final List<ExplorerCount> counts;
  final List<String> gaps;

  factory ExplorerOverview.fromJson(Map<String, dynamic> json) => _$ExplorerOverviewFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerOverviewToJson(this);
}
